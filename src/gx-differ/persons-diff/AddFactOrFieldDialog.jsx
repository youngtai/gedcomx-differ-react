import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { FACT_KEYS, GEDCOMX_ORIGINAL, PERSON_FIELD_TYPE } from "../constants";
import Dialog from "../Dialog";
import { RecordsDataContext } from "../RecordsContext";

const isNonEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
};

export default function AddFactOrFieldDialog({
  open,
  setOpen,
  parentObject,
  parentObjectIndex,
  factTypes,
  updateData,
}) {
  const recordsData = React.useContext(RecordsDataContext);

  const [type, setType] = React.useState("");
  const [date, setDate] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [value, setValue] = React.useState("");
  const [primary, setPrimary] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [age, setAge] = React.useState("");

  const newFact = {};
  if (isNonEmpty(type)) {
    newFact[FACT_KEYS.type] = type;
  }
  if (isNonEmpty(date)) {
    newFact[FACT_KEYS.date] = { original: date };
  }
  if (isNonEmpty(place)) {
    newFact[FACT_KEYS.place] = { original: place };
  }
  if (isNonEmpty(value)) {
    newFact[FACT_KEYS.value] = value;
  }
  newFact[FACT_KEYS.primary] = primary;
  const newRole =
    role !== ""
      ? {
          type: PERSON_FIELD_TYPE.Role,
          values: [{ type: GEDCOMX_ORIGINAL, text: role }],
        }
      : null;
  const newAge =
    age !== ""
      ? {
          type: PERSON_FIELD_TYPE.Age,
          values: [{ type: GEDCOMX_ORIGINAL, text: age.toString() }],
        }
      : null;

  function saveChanges() {
    setOpen(false);
    // Only add a new fact if it has more than just the 'primary' attribute
    let added = null;
    if (Object.keys(newFact).length > 1) {
      if (!parentObject.facts) {
        parentObject["facts"] = [];
      }
      added = parentObject.facts.push(newFact);
    }
    if (newRole) {
      if (!parentObject.fields) {
        parentObject["fields"] = [];
      }
      added = parentObject.fields.push(newRole);
    }
    if (newAge) {
      if (!parentObject.fields) {
        parentObject["fields"] = [];
      }
      added = parentObject.fields.push(newAge);
    }
    if (added) {
      parentObject.fields.sort((a, b) => a.type.localeCompare(b.type));
      updateData(parentObject, parentObjectIndex, recordsData);
      setType("");
      setDate("");
      setPlace("");
      setValue("");
      setPrimary(false);
      setRole("");
      setAge("");
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add Fact or Field</DialogTitle>
      <DialogContent>
        <Stack spacing={2} padding={2}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={(_, newValue) => setType(newValue)}>
              {Object.entries(factTypes).map(([key, value]) => (
                <Option key={`type-input-${key}`} value={value}>
                  {key}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input value={date} onChange={(e) => setDate(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Place</FormLabel>
            <Input value={place} onChange={(e) => setPlace(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Value</FormLabel>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
          </FormControl>
          <FormControl>
            <Checkbox
              label="Primary"
              checked={primary}
              onChange={(event) => setPrimary(event.target.checked)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Age</FormLabel>
            <Input value={age} onChange={(e) => setAge(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="neutral" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={saveChanges} sx={{ marginRight: 2 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddFactOrFieldDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  parentObject: PropTypes.object.isRequired,
  parentObjectIndex: PropTypes.number.isRequired,
  factTypes: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};
