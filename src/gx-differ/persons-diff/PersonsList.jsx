import { Box, Button, Stack } from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { AddIcon } from "../Icons";
import AddPersonDialog from "./AddPersonDialog";
import EditablePerson from "./EditablePerson";

export default function PersonsList({ persons }) {
  const [open, setOpen] = React.useState(false);

  function handleAddPerson() {
    setOpen(true);
  }

  return (
    <>
      <Button onClick={handleAddPerson} startDecorator={<AddIcon />}>
        Add Person
      </Button>
      <Box height={12} />
      <AddPersonDialog open={open} setOpen={setOpen} />
      <Stack spacing={2}>
        {persons.map((person, index) => (
          <EditablePerson
            key={`person-${index}`}
            person={person}
            personIndex={index}
          />
        ))}
      </Stack>
      {persons?.length > 0 && (
        <>
          <Box height={12} />
          <Button onClick={handleAddPerson} startDecorator={<AddIcon />}>
            Add Person
          </Button>
        </>
      )}
    </>
  );
}

PersonsList.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.object).isRequired,
};
