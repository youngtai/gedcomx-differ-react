import {
  Box,
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
import { useContext, useEffect, useState } from "react";
import { FACT_KEYS, FACT_QUALIFIER } from "../constants";
import { AddIcon, CancelIcon, DeleteIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import { makeQuestionableWhitespaceVisible } from "../Utils";
import { hasMatchingQualifier } from "./PersonDiffUtils";

export default function EditableFactQualifier({
  attributeData,
  qualifierIndex,
  fact,
  factIndex,
  parentObject,
  parentObjectIndex,
  comparingTo,
  updateData,
}) {
  const theme = useTheme();
  const recordsData = useContext(RecordsDataContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState(
    attributeData ? attributeData.qualifier.value : ""
  );
  const [newValue, setNewValue] = useState("");
  const [newName, setNewName] = useState("");
  const [hasMatch, setHasMatch] = useState(
    hasMatchingQualifier(attributeData, parentObject, comparingTo)
  );

  const backgroundColor = hasMatch ? "" : theme.palette.diff.background;
  const textColor = hasMatch ? "" : theme.palette.diff.color;

  useEffect(() => {
    setHasMatch(hasMatchingQualifier(attributeData, parentObject, comparingTo));
    setValue(attributeData.qualifier.value);
  }, [attributeData, parentObject, comparingTo]);

  function handleSave() {
    setIsEditing(false);
    fact[FACT_KEYS.qualifiers][qualifierIndex].value = value.toString();
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleAdd() {
    setIsAdding(true);
  }

  function handleSaveAdd() {
    setIsAdding(false);
    if (!newValue || !newName) {
      return;
    }
    fact.qualifiers.push({ name: newName, value: newValue.toString() });
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    delete fact[FACT_KEYS.qualifiers][qualifierIndex];
    fact[FACT_KEYS.qualifiers] = fact[FACT_KEYS.qualifiers].filter((e) => e);
    if (fact[FACT_KEYS.qualifiers].length === 0) {
      fact[FACT_KEYS.qualifiers] = null;
    }
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  const editableQualifier = (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{ padding: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid>
          <Typography level="body-sm" color={textColor}>
            {attributeData.qualifier.name}
          </Typography>
          <Typography level="body-xs" color={textColor}>
            Name
          </Typography>
        </Grid>
        <Grid xs>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            size="sm"
          />
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

  const addQualifier = (
    <Box sx={{ p: 1 }} hidden={!isAdding}>
      <Grid container spacing={1}>
        <Grid>
          <Select
            value={newName}
            onChange={(_, newValue) => setNewName(newValue)}
            size="sm"
            placeholder="Select a qualifier"
          >
            {Object.keys(FACT_QUALIFIER).map((key) => (
              <Option
                key={`qualifier-choice-${key}`}
                value={FACT_QUALIFIER[key]}
              >
                {key}
              </Option>
            ))}
          </Select>
        </Grid>
        <Grid xs>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            size="sm"
          />
        </Grid>
        <Grid>
          <Tooltip title="Cancel" arrow>
            <IconButton onClick={() => setIsAdding(false)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save" arrow>
            <IconButton onClick={handleSaveAdd}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );

  const qualifierItem = (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{ padding: 1, borderRadius: "sm", background: backgroundColor }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography level="body-sm" sx={{ color: textColor }}>
            {attributeData.qualifier.name}
          </Typography>
          <Typography level="body-xs" sx={{ color: textColor }}>
            Name
          </Typography>
        </Grid>
        <Grid>
          <Typography level="body-sm" sx={{ color: textColor }}>
            {makeQuestionableWhitespaceVisible(value)}
          </Typography>
          <Typography level="body-xs" sx={{ color: textColor }}>
            Value
          </Typography>
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

  return (
    <Box>
      <Box
        // sx={{ backgroundColor: "neutral.softBg", p: 1 }}
        hidden={qualifierIndex !== 0}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Typography level="title-md">Qualifiers</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleAdd} size="sm">
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      {addQualifier}
      {isEditing ? editableQualifier : qualifierItem}
    </Box>
  );
}

EditableFactQualifier.propTypes = {
  attributeData: PropTypes.object,
  qualifierIndex: PropTypes.number,
  fact: PropTypes.object,
  factIndex: PropTypes.number,
  parentObject: PropTypes.object,
  parentObjectIndex: PropTypes.number,
  comparingTo: PropTypes.array,
  updateData: PropTypes.func,
};
