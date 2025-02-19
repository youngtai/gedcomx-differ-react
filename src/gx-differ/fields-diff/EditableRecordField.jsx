import {
  Box,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Sheet,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { RECORD_FIELD_TYPE } from "../constants";
import { CancelIcon, DeleteIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import { hasMatchingField, updateFieldsData } from "./FieldsDiffUtils";
import { makeQuestionableWhitespaceVisible } from "../Utils";

export default function EditableRecordField({ field, fieldIndex }) {
  const theme = useTheme();
  const recordsData = React.useContext(RecordsDataContext);
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(field.values[0].text);
  const [type, setType] = React.useState(field.type);
  const [hasMatch, setHasMatch] = React.useState(
    hasMatchingField(field, recordsData.comparingToGx.fields)
  );

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;
  const textColor = hasMatch ? null : theme.palette.diff.color;

  React.useEffect(() => {
    setHasMatch(hasMatchingField(field, recordsData.comparingToGx.fields));
  }, [field, recordsData.comparingToGx.fields]);

  function handleSave() {
    setIsEditing(false);
    if (!value || !type) {
      return;
    }
    recordsData.gx.fields[fieldIndex].values[0].text = value;
    recordsData.gx.fields[fieldIndex].type = type;

    updateFieldsData(recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    const fields = recordsData.gx.fields;
    fields.splice(fieldIndex, 1);
    recordsData.gx.fields = fields.filter((f) => f);
    if (fields.length === 0) {
      delete recordsData.gx.fields;
    }

    updateFieldsData(recordsData);
  }

  return isEditing ? (
    <Sheet
      sx={{ padding: 2, background: backgroundColor, borderRadius: "sm" }}
      variant="outlined"
    >
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid xs>
          <Input
            placeholder="Enter record field value..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Box height={12} />
          <Select
            placeholder="Select record field type..."
            value={type}
            onChange={(_event, newValue) => setType(newValue)}
          >
            {Object.keys(RECORD_FIELD_TYPE).map((key) => (
              <Option key={`type-${key}`} value={RECORD_FIELD_TYPE[key]}>
                {key}
              </Option>
            ))}
          </Select>
        </Grid>
        <Grid>
          <Tooltip title="Save" arrow>
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel" arrow>
            <IconButton onClick={() => setIsEditing(false)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Sheet>
  ) : (
    <Sheet
      sx={{
        padding: 2,
        background: backgroundColor,
        color: textColor,
        borderRadius: "sm",
      }}
      variant="outlined"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography fontWeight="600">
            {makeQuestionableWhitespaceVisible(field.values[0].text)}
          </Typography>
          <Typography variant="body2">Field Value</Typography>
          <Box height={12} />
          <Typography fontWeight="600">
            {makeQuestionableWhitespaceVisible(field.type)}
          </Typography>
          <Typography variant="body2">Field Type</Typography>
        </Box>
        <Stack>
          <Tooltip title="Edit" arrow placement="left">
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow placement="left">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Sheet>
  );
}

EditableRecordField.propTypes = {
  field: PropTypes.object.isRequired,
  fieldIndex: PropTypes.number.isRequired,
};
