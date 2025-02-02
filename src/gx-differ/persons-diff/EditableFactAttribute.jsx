import {
  FormControl,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Sheet,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { AssertionsContext } from "../AssertionsContext";
import { FACT_KEYS, KEY_TO_LABEL_MAP } from "../constants";
import { CancelIcon, DeleteIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import {
  factIsEmpty,
  hasMatchingAttribute,
} from "../relationships-diff/RelationshipsDiffUtils";
import { makeQuestionableWhitespaceVisible } from "../Utils";

export default function EditableFactAttribute({
  attributeData,
  fact,
  factIndex,
  parentObject,
  parentObjectIndex,
  comparingTo,
  updateData,
  factTypes,
}) {
  const theme = useTheme();
  const recordsData = React.useContext(RecordsDataContext);
  const assertions = React.useContext(AssertionsContext).assertions;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editFieldValue, setEditFieldValue] = React.useState(
    attributeData ? attributeData.value : ""
  );
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingAttribute(
      attributeData,
      fact,
      parentObject,
      recordsData.gx.persons,
      comparingTo,
      recordsData.comparingToGx.persons,
      assertions
    )
  );

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;
  const textColor = hasMatch ? null : theme.palette.diff.color;

  React.useEffect(() => {
    setHasMatch(
      hasMatchingAttribute(
        attributeData,
        fact,
        parentObject,
        recordsData.gx.persons,
        comparingTo,
        recordsData.comparingToGx.persons,
        assertions
      )
    );
    setEditFieldValue(attributeData.value);
  }, [
    attributeData,
    parentObject,
    comparingTo,
    fact,
    recordsData.gx.persons,
    recordsData.comparingToGx.persons,
    assertions,
  ]);

  function handleSave() {
    setIsEditing(false);

    // To update the fact for the current side, I need the fact id and the attribute key.
    if (
      attributeData.key === FACT_KEYS.date ||
      attributeData.key === FACT_KEYS.place
    ) {
      fact[attributeData.key].original = editFieldValue;
    } else {
      fact[attributeData.key] = editFieldValue;
    }
    attributeData.value = editFieldValue;
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    delete fact[attributeData.key];
    if (factIsEmpty(fact)) {
      delete parentObject.facts[factIndex];
      parentObject.facts = parentObject.facts.filter((e) => e); // Remove 'empty' elements after deleting a fact
    } else {
      parentObject.facts.splice(factIndex, 1, fact);
    }
    // If there are no facts, rather than leaving fact: [] behind, just remove the fact key
    if (parentObject.facts.length === 0) {
      delete parentObject.facts;
    }
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  const editableFactAttribute = (
    <Sheet
      variant="soft"
      color="warning"
      sx={{ padding: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container direction="row" spacing={1} alignItems="center">
        <Grid xs>
          {attributeData.key === "type" ? (
            <FormControl fullwidth>
              <Select
                value={editFieldValue}
                onChange={(_event, newValue) => setEditFieldValue(newValue)}
                size="sm"
                sx={{ marginY: 1 }}
              >
                {Object.keys(factTypes).map((key) => (
                  <Option key={`type-${key}`} value={factTypes[key]}>
                    {key}
                  </Option>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Input
              value={editFieldValue}
              fullwidth
              size="sm"
              onChange={(event) => setEditFieldValue(event.target.value)}
              sx={{ marginY: 1 }}
            />
          )}
        </Grid>
        <Grid>
          <Tooltip title="Cancel" arrow>
            <IconButton onClick={() => setIsEditing(false)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save" arrow>
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Sheet>
  );

  const factAttribute = (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{ paddingX: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Grid container direction="column">
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: textColor }}
            >
              {makeQuestionableWhitespaceVisible(editFieldValue)}
            </Typography>
            <Typography variant="body2" sx={{ color: textColor }}>
              {KEY_TO_LABEL_MAP[attributeData.key]}
            </Typography>
          </Grid>
        </Grid>
        <Grid alignItems="center" justifyContent="center">
          <Tooltip title="Edit" arrow>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Sheet>
  );

  return isEditing ? editableFactAttribute : factAttribute;
}

EditableFactAttribute.propTypes = {
  attributeData: PropTypes.object.isRequired,
  fact: PropTypes.object.isRequired,
  factIndex: PropTypes.number.isRequired,
  parentObject: PropTypes.object.isRequired,
  parentObjectIndex: PropTypes.number.isRequired,
  comparingTo: PropTypes.array,
  updateData: PropTypes.func.isRequired,
  factTypes: PropTypes.object.isRequired,
};
