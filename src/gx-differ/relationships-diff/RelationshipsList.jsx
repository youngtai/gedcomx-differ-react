import { Box, Button, Stack } from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { AddIcon } from "../Icons";
import AddRelationshipDialog from "./AddRelationshipDialog";
import { EditableRelationship } from "./EditableRelationship";

export default function RelationshipsList({ rels, persons }) {
  const [open, setOpen] = React.useState(false);

  function handleAddRelationship() {
    setOpen(true);
  }

  return (
    <>
      <AddRelationshipDialog open={open} setOpen={setOpen} />
      <Button onClick={handleAddRelationship} startDecorator={<AddIcon />}>
        Add Relationship
      </Button>
      <Box height={12} />
      <Stack spacing={2}>
        {rels?.map((rel, relIndex) => (
          <EditableRelationship
            key={`rel-${relIndex}`}
            rel={rel}
            relIndex={relIndex}
            persons={persons}
          />
        ))}
      </Stack>
      {rels?.length > 2 && (
        <Button onClick={handleAddRelationship} startDecorator={<AddIcon />}>
          Add Relationship
        </Button>
      )}
    </>
  );
}

RelationshipsList.propTypes = {
  rels: PropTypes.array,
  persons: PropTypes.array,
};
