import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Sequelize } from 'sequelize';

import { PaymentLogsModel } from './payment_logs';

// This is a real-database test (not mocked Sequelize) so we can prove actual
// Postgres/Sequelize constraint and persistence behavior (ENUM rejection,
// JSON round-tripping, multiple rows per transaction id), matching the
// existing `__tests__/test-app.ts` convention of using
// `@testcontainers/postgresql` for real-DB coverage. There is no existing
// narrower per-model *.spec.ts to follow in `src/models/` (the only sibling,
// `model.spec.ts`, mocks `global.db` entirely and only covers the
// DB-agnostic `prepareSort` helper), so this file defines its own minimal
// harness: a real Postgres container + a real Sequelize connection, with the
// `payment_logs` table/ENUM created via the model's own `sync()` (mirroring
// how Sequelize itself would materialize the model definition), rather than
// booting the full `TestApp` (app/routes/redis/migrations) which this
// model-only test does not need.
jest.setTimeout(60000);

describe('PaymentLogsModel', () => {
  let container: StartedPostgreSqlContainer;
  let sequelize: Sequelize;
  let paymentLogsModel: PaymentLogsModel;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16').start();

    sequelize = new Sequelize(
      container.getDatabase(),
      container.getUsername(),
      container.getPassword(),
      {
        host: container.getHost(),
        port: container.getMappedPort(5432),
        dialect: 'postgres',
        logging: false,
      }
    );

    await sequelize.authenticate();

    (global as any).db = sequelize;

    paymentLogsModel = new PaymentLogsModel();

    // Materialize the `payment_logs` table (and its `payment_action` ENUM
    // type) from the model definition itself against the real database.
    await paymentLogsModel.model.sync({ force: true });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
    if (container) {
      await container.stop();
    }
    delete (global as any).db;
  });

  afterEach(async () => {
    // Keep each test's assertions about "which rows exist" independent.
    await paymentLogsModel.model.destroy({ where: {}, truncate: true });
  });

  describe('save', () => {
    it('persists a "raw" row with transaction_id, payment_action and data exactly as given, including nested objects', async () => {
      const paymentData = {
        amount: 1500,
        currency: 'UAH',
        card: { masked: '444455******1111', brand: 'visa' },
        meta: { attempts: [1, 2, 3], flags: { retried: false } },
      };

      const isSaved = await paymentLogsModel.save({
        transactionId: 'txn-raw-1',
        paymentAction: 'raw',
        paymentData,
      });

      expect(isSaved).toBe(1);

      const rows = await paymentLogsModel.model.findAll({ where: { transaction_id: 'txn-raw-1' } });
      expect(rows).toHaveLength(1);

      const row = rows[0].get({ plain: true });
      expect(row.transaction_id).toBe('txn-raw-1');
      expect(row.payment_action).toBe('raw');
      expect(row.data).toEqual(paymentData);
      // Confirm the JSON payload was not mutated by the save/round-trip.
      expect(row.data).not.toBe(paymentData);
    });

    it('creates a second, separate row when saving a "processed" entry for the same transactionId (not an update/upsert)', async () => {
      const transactionId = 'txn-shared-2';

      await paymentLogsModel.save({
        transactionId,
        paymentAction: 'raw',
        paymentData: { stage: 'raw-payload' },
      });

      await paymentLogsModel.save({
        transactionId,
        paymentAction: 'processed',
        paymentData: { stage: 'processed-payload' },
      });

      const rows = await paymentLogsModel.model.findAll({
        where: { transaction_id: transactionId },
        order: [['payment_action', 'ASC']],
      });

      expect(rows).toHaveLength(2);

      const actions = rows.map((row) => row.get('payment_action')).sort();
      expect(actions).toEqual(['processed', 'raw']);

      // Confirm both rows are distinct records with distinct ids and their
      // own data payloads (i.e. the second save did not overwrite the first).
      const [first, second] = rows;
      expect(first.get('id')).not.toBe(second.get('id'));

      const rawRow = rows.find((row) => row.get('payment_action') === 'raw').get({ plain: true });
      const processedRow = rows.find((row) => row.get('payment_action') === 'processed').get({ plain: true });
      expect(rawRow.data).toEqual({ stage: 'raw-payload' });
      expect(processedRow.data).toEqual({ stage: 'processed-payload' });
    });

    it('rejects an invalid paymentAction value via the ENUM constraint', async () => {
      await expect(
        paymentLogsModel.save({
          transactionId: 'txn-invalid-enum',
          paymentAction: 'not-a-real-action',
          paymentData: { any: 'thing' },
        })
      ).rejects.toMatchObject({
        name: expect.stringMatching(/SequelizeDatabaseError/),
        parent: expect.objectContaining({
          // Postgres error code 22P02 = invalid_text_representation, which is
          // what Postgres raises for a value outside an ENUM's allowed set.
          code: '22P02',
        }),
      });

      const rows = await paymentLogsModel.model.findAll({ where: { transaction_id: 'txn-invalid-enum' } });
      expect(rows).toHaveLength(0);
    });

    it('accepts arbitrary JSON-serializable payloads and returns them byte-for-byte equivalent after a re-fetch', async () => {
      const webhookLikePayload = {
        event: 'payment.status.changed',
        transaction: {
          id: 'txn-json-3',
          status: 'success',
          amount: { value: 249.99, currency: 'UAH' },
        },
        items: [
          { sku: 'A-1', qty: 2, tags: ['fragile', 'gift'] },
          { sku: 'B-7', qty: 1, tags: [] },
        ],
        signature: null,
        raw: 'some-string-value',
        flags: { paid: true, refunded: false },
      };

      await paymentLogsModel.save({
        transactionId: 'txn-json-3',
        paymentAction: 'processed',
        paymentData: webhookLikePayload,
      });

      const refetched = await paymentLogsModel.model.findOne({ where: { transaction_id: 'txn-json-3' } });
      const plain = refetched.get({ plain: true });

      expect(plain.data).toEqual(webhookLikePayload);
      expect(JSON.stringify(plain.data)).toEqual(JSON.stringify(webhookLikePayload));
    });
  });
});
