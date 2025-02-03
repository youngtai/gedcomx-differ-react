import {
  Box,
  Grid,
  IconButton,
  Sheet,
  Stack,
  Textarea,
  Typography,
  useTheme,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { CancelIcon, EditIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import { sideIncludesDocument } from "./DocumentsDiffUtils";

function hasMatchingDocument(document, comparingTo) {
  return sideIncludesDocument(document, comparingTo);
}

export default function EditableDocument({ document, documentIndex }) {
  const theme = useTheme();
  const recordsData = React.useContext(RecordsDataContext);
  const [isEditing, setIsEditing] = React.useState(false);
  const [text, setText] = React.useState(document.text);
  const [hasMatch, setHasMatch] = React.useState(hasMatchingDocument);

  const backgroundColor = hasMatch ? null : theme.palette.diff.background;
  const textColor = hasMatch ? null : theme.palette.diff.color;

  React.useEffect(() => {
    setHasMatch(
      hasMatchingDocument(document, recordsData.comparingToGx.documents)
    );
  }, [document, recordsData.comparingToGx.documents]);

  function handleSave() {
    setIsEditing(false);
    if (!text) {
      return;
    }
    recordsData.gx.documents[documentIndex].text = text;
  }

  function handleEdit() {
    setIsEditing(true);
  }

  return isEditing ? (
    <Sheet sx={{ padding: 2, borderRadius: "sm" }} variant="outlined">
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid xs>
          <Stack spacing={2}>
            <div>
              <Typography>{document.id}</Typography>
              <Typography variant="body-sm">Id</Typography>
            </div>
            <Textarea
              value={text}
              minRows={3}
              onChange={(e) => setText(e.target.value)}
            />
          </Stack>
        </Grid>
        <Grid>
          <IconButton onClick={handleSave}>
            <SaveIcon />
          </IconButton>

          <IconButton onClick={() => setIsEditing(false)}>
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Sheet>
  ) : (
    <Sheet sx={{ borderRadius: "sm" }} variant="outlined">
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ background: backgroundColor, color: textColor, padding: 2 }}
      >
        <Grid>
          <Stack spacing={2}>
            <div>
              <Typography>{document.id}</Typography>
              <Typography variant="body-sm">Id</Typography>
            </div>

            <div>
              <Box>
                {document?.text?.split("\n")?.map((piece, index) => (
                  <Typography key={`piece-${index}`}>{piece}</Typography>
                ))}
              </Box>
              <Typography variant="body-sm">Text</Typography>
            </div>
          </Stack>
        </Grid>
        <Grid>
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Sheet>
  );
}

EditableDocument.propTypes = {
  document: PropTypes.object,
  documentIndex: PropTypes.number,
};
