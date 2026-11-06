import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LeftSidebarLayout from "layouts/LeftSidebar";
import DataTable from "components/DataTable";
import CabinetMenuDialog from "./components/CabinetMenuDialog";
import useCabinetMenuPage from "./hooks/useCabinetMenuPage";
import useCabinetMenuColumns from "./hooks/useCabinetMenuColumns";

const CabinetMenuToolbar = React.memo(({
  canEdit,
  onCreate,
  onExportSelected,
  onImportFile,
  selectedCount,
  t,
}) => {
  const importInputRef = React.useRef(null);

  return (
    // Buttons space themselves (theme.buttonGap); the hidden file input goes last so the
    // first button really is the row's first child.
    <div style={{ display: "flex" }}>
      {canEdit ? (
        <>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onCreate}
          >
            {t("CreateRoot")}
          </Button>
        </>
      ) : null}
      <Button
        color="primary"
        variant="outlined"
        startIcon={<FileDownloadOutlinedIcon />}
        disabled={!selectedCount}
        onClick={onExportSelected}
      >
        {t("ExportSelected")}
      </Button>
      {canEdit ? (
        <Button
          color="primary"
          variant="outlined"
          startIcon={<FileUploadOutlinedIcon />}
          onClick={() => importInputRef.current?.click()}
        >
          {t("ImportFromFile")}
        </Button>
      ) : null}
      {canEdit ? (
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            onImportFile(event.target.files?.[0]);
            event.target.value = null;
          }}
          hidden={true}
        />
      ) : null}
    </div>
  );
});

const CabinetMenuPage = () => {
  const {
    t,
    canEdit,
    createOpen,
    expanded,
    localItems,
    flattenedData,
    tableProps,
    selectedIds,
    toggleExpanded,
    handleOpenCreate,
    handleCloseCreate,
    handleExportSelected,
    handleImportFile,
    handleItemAction,
    handleRowSortEnd,
  } = useCabinetMenuPage();

  const CustomToolbar = React.useMemo(() => {
    const ToolbarComponent = () => (
      <CabinetMenuToolbar
        canEdit={canEdit}
        onCreate={handleOpenCreate}
        onExportSelected={handleExportSelected}
        onImportFile={handleImportFile}
        selectedCount={selectedIds.length}
        t={t}
      />
    );

    return ToolbarComponent;
  }, [canEdit, handleExportSelected, handleImportFile, handleOpenCreate, selectedIds.length, t]);

  const columns = useCabinetMenuColumns({
    t,
    expanded,
    toggleExpanded,
    localItems,
    canEdit,
    handleItemAction,
  });

  return (
    <LeftSidebarLayout title={t("Title")} location={location} loading={tableProps.loading}>
      <DataTable
        {...tableProps}
        data={flattenedData}
        title={t("Title")}
        darkTheme={true}
        columns={columns}
        checkable={true}
        controls={{
          pagination: false,
          toolbar: true,
          search: false,
          header: true,
          refresh: true,
          switchView: false,
          customizateColumns: false,
          bottomPagination: false,
          sortableRows: canEdit,
          rowDragHandleColumnId: "tree",
        }}
        getRowSortId={(row) => row.id}
        onRowSortEnd={handleRowSortEnd}
        CustomToolbar={CustomToolbar}
      />
      <CabinetMenuDialog
        open={createOpen}
        onClose={handleCloseCreate}
        onAction={handleItemAction}
        items={localItems}
      />
    </LeftSidebarLayout>
  );
};

export default CabinetMenuPage;
