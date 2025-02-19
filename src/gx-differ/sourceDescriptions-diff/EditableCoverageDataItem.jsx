import {
  Box,
  Grid,
  IconButton,
  Input,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { CancelIcon, DeleteIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import {
  hasMatchingCoverageDataItem,
  updateSourceDescriptionsData,
} from "./SourceDescriptionsDiffUtils";
import { makeQuestionableWhitespaceVisible } from "../Utils";

export default function EditableCoverageDataItem({
  coverageItem,
  coverageIndex,
  label,
  sourceDescriptionIndex,
}) {
  const theme = useTheme();

  const recordsData = React.useContext(RecordsDataContext);
  const sourceDescriptions = recordsData.gx.sourceDescriptions;
  const comparingTo = recordsData.comparingToGx.sourceDescriptions;

  const [editFieldValue, setEditFieldValue] = React.useState(
    coverageItem?.original !== undefined && coverageItem?.original !== null
      ? coverageItem.original
      : coverageItem || ""
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingCoverageDataItem(coverageItem, label, comparingTo)
  );

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;
  const textColor = hasMatch ? null : theme.palette.diff.color;

  React.useEffect(() => {
    setHasMatch(hasMatchingCoverageDataItem(coverageItem, label, comparingTo));
    setEditFieldValue(
      coverageItem?.original !== undefined && coverageItem?.original !== null
        ? coverageItem.original
        : coverageItem || ""
    );
  }, [coverageItem, label, comparingTo]);

  function handleOnEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    if (label === "Spatial") {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex]
        .spatial;
    }
    if (label === "Temporal") {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex]
        .temporal;
    }
    if (label === "Record Type") {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex]
        .recordType;
    }
    updateSourceDescriptionsData(recordsData);
  }

  function handleOnSave() {
    setIsEditing(false);
    if (label === "Spatial") {
      coverageItem.original = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[
        coverageIndex
      ].spatial = coverageItem;
    } else if (label === "Temporal") {
      coverageItem.original = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[
        coverageIndex
      ].temporal = coverageItem;
    } else if (label === "Record Type") {
      coverageItem = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[
        coverageIndex
      ].recordType = coverageItem;
    }
    updateSourceDescriptionsData(recordsData);
  }

  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {isEditing ? (
          <>
            <Grid xs>
              <Input
                value={editFieldValue}
                fullwidth
                onChange={(e) => setEditFieldValue(e.target.value)}
              />
            </Grid>
            <Grid>
              <IconButton onClick={(prevValue) => setIsEditing(!prevValue)}>
                <CancelIcon />
              </IconButton>
              <IconButton onClick={handleOnSave}>
                <SaveIcon />
              </IconButton>
            </Grid>
          </>
        ) : (
          <>
            <div>
              <Typography fontWeight="600">
                {makeQuestionableWhitespaceVisible(editFieldValue)}
              </Typography>
              <Typography variant="body2">{label}</Typography>
            </div>
            <div>
              <Tooltip title="Edit" arrow placement="left">
                <IconButton onClick={handleOnEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow placement="right">
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </>
        )}
      </Grid>
    </Box>
  );
}

EditableCoverageDataItem.propTypes = {
  coverageItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  coverageIndex: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  sourceDescriptionIndex: PropTypes.number.isRequired,
};
