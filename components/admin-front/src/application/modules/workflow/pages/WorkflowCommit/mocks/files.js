// PoC (poc/git-version-control): stub file contents of a workflow's git repository, so the
// commit page has a project tree and before/after versions to show. Front-end only.
//
// A workflow repo holds index.json, the BPMN schema and one JSON file per element, grouped
// in folders by element type. Tasks and their document templates share an id, so the same
// file name (e.g. 1610124001.json) appears in both tasks/ and documents/.
import mockCommits from '../../WorkflowCommits/mocks/commits';

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const clone = (value) => JSON.parse(JSON.stringify(value));

// ---- Base project: the state right before the latest commit -----------------------------

const index = {
  accessUnits: [],
  createdAt: '2026-10-19T09:13:14.864Z',
  data: {
    entryTaskTemplateIds: [{ hidden: true, id: '1610124001', name: 'Start' }],
    statuses: []
  },
  description: '',
  id: 1610124,
  isActive: true,
  meta: {},
  name: 'Registry application',
  workflowTemplateCategoryId: 29
};

const tasks = {
  1610124001: {
    id: 1610124001,
    name: 'Start',
    documentTemplateId: 1610124001,
    taskTemplateEntity: { isEntry: true, signerUsers: [], performerUnits: [] },
    jsonSchema: { isPaymentRequired: false, finalScreen: { title: 'Application submitted' } }
  },
  1610124002: {
    id: 1610124002,
    name: 'Check documents',
    documentTemplateId: 1610124002,
    taskTemplateEntity: {
      performerUnits: [],
      performerUsers: ['5f1c2a9e0b7d4e3a91c8f201'],
      deadline: '5 working days'
    },
    jsonSchema: { checkSignatures: true }
  },
  1610124003: {
    id: 1610124003,
    name: 'Prepare decision',
    documentTemplateId: 1610124003,
    taskTemplateEntity: { performerUnits: [1000045], performerUsers: [] },
    jsonSchema: { checkSignatures: true }
  }
};

const documents = {
  1610124001: {
    id: 1610124001,
    name: 'Application form',
    jsonSchema: {
      title: 'Application',
      properties: {
        applicant: { type: 'object', description: 'Applicant' },
        registryObject: { type: 'string', description: 'Registry object' },
        attachments: { type: 'array', description: 'Supporting documents' }
      },
      required: ['applicant', 'registryObject']
    }
  },
  1610124002: {
    id: 1610124002,
    name: 'Document check',
    jsonSchema: {
      title: 'Document check',
      properties: {
        documentsValid: { type: 'boolean', description: 'Documents are valid' },
        comment: { type: 'string', description: 'Comment' }
      }
    }
  },
  1610124003: {
    id: 1610124003,
    name: 'Decision',
    jsonSchema: {
      title: 'Decision',
      properties: {
        summary: { type: 'string', description: 'Case summary' },
        decision: { type: 'string', enum: ['approve', 'reject'], description: 'Decision' },
        notificationText: { type: 'string', description: 'Text sent to the applicant' }
      },
      required: ['decision', 'notificationText']
    }
  }
};

const gateways = {
  1610124021: {
    id: 1610124021,
    name: 'Is payment required',
    jsonSchema: { formulas: [{ condition: '(documents) => documents[1610124001].isPaymentRequired' }] }
  },
  1610124022: {
    id: 1610124022,
    name: 'Legacy export',
    jsonSchema: { formulas: [{ condition: '() => false' }] }
  }
};

const events = {
  1610124031: {
    id: 1610124031,
    name: 'Notify applicant',
    eventTypeId: 2,
    jsonSchema: { message: { templateId: 17, to: 'applicant' } }
  }
};

const BPMN_BEFORE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1610124">
  <bpmn:process id="Process_1610124" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
    <bpmn:task id="task-1610124001" name="Start" />
    <bpmn:exclusiveGateway id="gateway-1610124021" name="Is payment required" />
    <bpmn:task id="task-1610124002" name="Check documents" />
    <bpmn:exclusiveGateway id="gateway-1610124022" name="Legacy export" />
    <bpmn:task id="task-1610124003" name="Prepare decision" />
    <bpmn:intermediateThrowEvent id="event-1610124031" name="Notify applicant" />
    <bpmn:endEvent id="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="task-1610124001" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="task-1610124001" targetRef="gateway-1610124021" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="gateway-1610124021" targetRef="task-1610124002" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="task-1610124002" targetRef="gateway-1610124022" />
    <bpmn:sequenceFlow id="Flow_5" sourceRef="gateway-1610124022" targetRef="task-1610124003" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="gateway-1610124022" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_7" sourceRef="task-1610124003" targetRef="event-1610124031" />
    <bpmn:sequenceFlow id="Flow_8" sourceRef="event-1610124031" targetRef="EndEvent_1" />
  </bpmn:process>
</bpmn:definitions>
`;

const BPMN_AFTER = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1610124">
  <bpmn:process id="Process_1610124" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
    <bpmn:task id="task-1610124001" name="Start" />
    <bpmn:exclusiveGateway id="gateway-1610124021" name="Is payment required" />
    <bpmn:task id="task-1610124002" name="Check documents" />
    <bpmn:boundaryEvent id="event-1610124032" name="Payment reminder" attachedToRef="task-1610124002">
      <bpmn:timerEventDefinition id="Timer_1" />
    </bpmn:boundaryEvent>
    <bpmn:task id="task-1610124003" name="Prepare decision" />
    <bpmn:intermediateThrowEvent id="event-1610124031" name="Notify applicant" />
    <bpmn:endEvent id="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_Expired" name="Expired" />
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="task-1610124001" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="task-1610124001" targetRef="gateway-1610124021" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="gateway-1610124021" targetRef="task-1610124002" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="task-1610124002" targetRef="task-1610124003" />
    <bpmn:sequenceFlow id="Flow_7" sourceRef="task-1610124003" targetRef="event-1610124031" />
    <bpmn:sequenceFlow id="Flow_8" sourceRef="event-1610124031" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_9" sourceRef="event-1610124032" targetRef="EndEvent_Expired" />
  </bpmn:process>
</bpmn:definitions>
`;

const baseFiles = () => ({
  'index.json': json(index),
  'xmlBpmnSchema.bpmn': BPMN_BEFORE,
  ...Object.fromEntries(Object.entries(tasks).map(([id, v]) => [`tasks/${id}.json`, json(v)])),
  ...Object.fromEntries(
    Object.entries(documents).map(([id, v]) => [`documents/${id}.json`, json(v)])
  ),
  ...Object.fromEntries(Object.entries(gateways).map(([id, v]) => [`gateways/${id}.json`, json(v)])),
  ...Object.fromEntries(Object.entries(events).map(([id, v]) => [`events/${id}.json`, json(v)]))
});

// ---- Changes per commit -------------------------------------------------------------------
// Each change set maps a path to its new content (or null when the file is deleted).

const withChange = (source, update) => {
  const value = clone(source);
  update(value);
  return json(value);
};

// The latest commit: matches its message (signing order, payment timer, unit assignment,
// split decision form, removed "Legacy export" gateway).
const latestChanges = () => ({
  'xmlBpmnSchema.bpmn': BPMN_AFTER,
  'tasks/1610124002.json': withChange(tasks[1610124002], (task) => {
    task.taskTemplateEntity.performerUnits = [1000046];
    task.taskTemplateEntity.performerUsers = [];
  }),
  'documents/1610124003.json': withChange(documents[1610124003], (doc) => {
    doc.jsonSchema = {
      title: 'Decision',
      steps: ['summary', 'decision', 'notification'],
      properties: {
        summary: {
          type: 'object',
          description: 'Summary',
          properties: { caseSummary: { type: 'string', description: 'Case summary' } }
        },
        decision: {
          type: 'object',
          description: 'Decision',
          properties: {
            decision: { type: 'string', enum: ['approve', 'reject'], description: 'Decision' }
          },
          required: ['decision']
        },
        notification: {
          type: 'object',
          description: 'Notification',
          properties: {
            notificationText: { type: 'string', description: 'Text sent to the applicant' }
          },
          required: ['notificationText']
        }
      }
    };
  }),
  'events/1610124032.json': json({
    id: 1610124032,
    name: 'Payment reminder',
    eventTypeId: 5,
    jsonSchema: { timer: { delay: '48h', repeat: 1 }, onExpire: 'EndEvent_Expired' }
  }),
  'gateways/1610124022.json': null
});

// Smaller, generic change sets for the other commits (picked by the commit's position).
const genericChanges = [
  () => ({
    'tasks/1610124001.json': withChange(tasks[1610124001], (task) => {
      task.jsonSchema.isPaymentRequired = true;
    })
  }),
  () => ({
    'index.json': withChange(index, (value) => {
      value.description = 'Application to the state registry';
    }),
    'documents/1610124001.json': withChange(documents[1610124001], (doc) => {
      doc.jsonSchema.properties.phone = { type: 'string', description: 'Contact phone' };
    })
  }),
  () => ({
    'gateways/1610124021.json': withChange(gateways[1610124021], (gateway) => {
      gateway.jsonSchema.formulas[0].condition =
        '(documents) => documents[1610124001].isPaymentRequired === true';
    }),
    'events/1610124031.json': withChange(events[1610124031], (event) => {
      event.jsonSchema.message.templateId = 18;
    })
  })
];

const languageOf = (path) => (path.endsWith('.bpmn') ? 'xml' : 'json');

// Every file of the project at this commit, with its status and before/after content:
// status is 'added' | 'modified' | 'deleted' | null (unchanged).
export const getCommitFiles = (sha) => {
  const position = mockCommits.findIndex((commit) => commit.sha === sha);
  const base = baseFiles();

  // The first commit in history adds the whole project.
  if (position === mockCommits.length - 1) {
    return Object.entries(base).map(([path, content]) => ({
      path,
      status: 'added',
      before: null,
      after: content,
      language: languageOf(path)
    }));
  }

  const changes =
    position <= 0 ? latestChanges() : genericChanges[position % genericChanges.length]();

  const paths = [...new Set([...Object.keys(base), ...Object.keys(changes)])];

  return paths.map((path) => {
    const before = base[path] ?? null;
    const after = path in changes ? changes[path] : before;
    let status = null;
    if (before === null && after !== null) status = 'added';
    else if (before !== null && after === null) status = 'deleted';
    else if (before !== after) status = 'modified';

    return { path, status, before, after, language: languageOf(path) };
  });
};
