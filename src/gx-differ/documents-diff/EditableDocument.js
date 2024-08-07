import React from 'react'
import { RecordsDataContext } from '../RecordsContext'
import {
  Button,
  Grid,
  ListItemText,
  Paper,
  TextField,
  useTheme,
} from '@mui/material'
import { sideIncludesDocument } from './DocumentsDiff'

function hasMatchingDocumment(document, comparingTo) {
  return sideIncludesDocument(document, comparingTo)
}

export default function EditableDocument({ document, documentIndex }) {
  const theme = useTheme()
  const recordsData = React.useContext(RecordsDataContext)
  const [isEditing, setIsEditing] = React.useState(false)
  const [text, setText] = React.useState(document.text)
  const [hasMatch, setHasMatch] = React.useState(hasMatchingDocumment)

  const backgroundColor = hasMatch ? null : theme.palette.diff.background
  const textColor = hasMatch ? null : theme.palette.diff.color

  React.useEffect(() => {
    setHasMatch(
      hasMatchingDocumment(document, recordsData.comparingToGx.documents)
    )
  }, [document, recordsData.comparingToGx.documents])

  function handleSave() {
    setIsEditing(false)
    if (!text) {
      return
    }
    recordsData.gx.documents[documentIndex].text = text

    // updateDocumentsData(recordsData);
  }

  function handleEdit() {
    setIsEditing(true)
  }

  return isEditing ? (
    <Paper sx={{ margin: 2, padding: 1 }} square elevation={4}>
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={10}>
          <Grid container direction="column">
            <Grid item>
              <ListItemText primary={document.id} secondary={'Id'} />
            </Grid>
            <Grid item>
              <TextField
                value={text}
                size="small"
                fullWidth={true}
                multiline
                onChange={(e) => setText(e.target.value)}
                sx={{ marginY: 1 }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </Paper>
  ) : (
    <Paper sx={{ margin: 2 }} square elevation={4}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ background: backgroundColor, paddingLeft: 2 }}
      >
        <Grid item xs={10}>
          <Grid container direction="column" sx={{ color: textColor }}>
            <Grid item>
              <ListItemText primary={document.id} secondary={'Id'} />
            </Grid>
            <Grid item>
              <ListItemText
                primary={document?.text?.split('\n')?.map((piece, index) => (
                  <div key={`piece-${index}`}>{piece}</div>
                ))}
                secondary={'Text'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleEdit}>Edit</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
