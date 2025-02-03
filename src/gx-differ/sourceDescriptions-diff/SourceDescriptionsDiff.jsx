import { Box, Grid } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { JsonEditor, githubDarkTheme, githubLightTheme } from "json-edit-react";
import PropTypes from "prop-types";
import { RecordsDataContext } from "../RecordsContext";
import { leftRecordsData, rightRecordsData } from "../Utils";
import EditableRecordSourceDescription from "./EditableRecordSourceDescription";

function SourceDescriptionItem({ sourceDescription, idx }) {
  const { systemMode } = useColorScheme();

  if (sourceDescription.resourceType === "http://gedcomx.org/DigitalArtifact") {
    return (
      <Box
        sx={{ marginBottom: 1 }} // Added margin for better spacing
      >
        <strong>{sourceDescription.about}</strong>
        <div>DigitalArtifact</div>
      </Box>
    );
  } else if (sourceDescription.resourceType === "http://gedcomx.org/Record") {
    return (
      <EditableRecordSourceDescription
        recordSourceDescription={sourceDescription}
        sourceDescriptionIndex={idx}
      />
    );
  } else {
    return (
      <Box sx={{ marginBottom: 1 }}>
        <JsonEditor
          data={sourceDescription}
          rootName="sourceDescription"
          collapse={true}
          theme={systemMode === "dark" ? githubDarkTheme : githubLightTheme}
          restrictEdit={true}
          restrictAdd={true}
          restrictDelete={true}
          restrictTypeSelection={true}
        />
      </Box>
    );
  }
}

// Comparing sourceDescriptions of type Record (just comparing the coverage elements)
export default function SourceDescriptionsDiff({
  leftGx,
  setLeftGx,
  rightGx,
  setRightGx,
  finalGx,
  setFinalGx,
}) {
  const left = leftGx.sourceDescriptions;
  const right = rightGx.sourceDescriptions;

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid xs={6}>
        <RecordsDataContext.Provider
          value={leftRecordsData(
            leftGx,
            setLeftGx,
            rightGx,
            setRightGx,
            finalGx,
            setFinalGx
          )}
        >
          {left?.map((sourceDescription, idx) => (
            <SourceDescriptionItem
              sourceDescription={sourceDescription}
              idx={idx}
              key={`sourceDescription-${idx}`}
            />
          ))}
        </RecordsDataContext.Provider>
      </Grid>
      <Grid xs={6}>
        <RecordsDataContext.Provider
          value={rightRecordsData(
            leftGx,
            setLeftGx,
            rightGx,
            setRightGx,
            finalGx,
            setFinalGx
          )}
        >
          {right?.map((sourceDescription, idx) => (
            <SourceDescriptionItem
              sourceDescription={sourceDescription}
              idx={idx}
              key={`sourceDescription-${idx}`}
            />
          ))}
        </RecordsDataContext.Provider>
      </Grid>
    </Grid>
  );
}

SourceDescriptionItem.propTypes = {
  sourceDescription: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};

SourceDescriptionsDiff.propTypes = {
  leftGx: PropTypes.object.isRequired,
  setLeftGx: PropTypes.func.isRequired,
  rightGx: PropTypes.object.isRequired,
  setRightGx: PropTypes.func.isRequired,
  finalGx: PropTypes.object.isRequired,
  setFinalGx: PropTypes.func.isRequired,
};
