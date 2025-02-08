import { Button, Stack } from "@mui/joy";
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
      <Button
        sx={{ mx: 2 }}
        onClick={handleAddPerson}
        startDecorator={<AddIcon />}
      >
        Add Person
      </Button>
      <AddPersonDialog open={open} setOpen={setOpen} />
      <Stack>
        {persons.map((person, index) => (
          <EditablePerson
            key={`person-${index}`}
            person={person}
            personIndex={index}
          />
        ))}
      </Stack>
      {persons?.length > 0 && (
        <Button
          sx={{ mx: 2 }}
          onClick={handleAddPerson}
          startDecorator={<AddIcon />}
        >
          Add Person
        </Button>
      )}
    </>
  );
}

PersonsList.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.object).isRequired,
};
