import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Tooltip,
} from "@mui/joy";
import PropTypes from "prop-types";
import React from "react";
import { FACT_KEYS, FACT_QUALIFIER } from "../constants";
import { AddIcon, CancelIcon, SaveIcon } from "../Icons";
import { RecordsDataContext } from "../RecordsContext";
import EditableFactAttribute from "./EditableFactAttribute";
import EditableFactQualifier from "./EditableFactQualifier";
import PrimaryFactSwitchItem from "./PrimaryFactSwitchItem";

function getMissingAttributes(presentAttributes) {
  return Object.entries(FACT_KEYS)
    .filter(([key]) => !presentAttributes.includes(key))
    .map(([, value]) => value);
}

export default function EditableFact({
  fact,
  factIndex,
  parentObject,
  parentObjectIndex,
  comparingTo,
  updateData,
  factTypes,
}) {
  const recordsData = React.useContext(RecordsDataContext);

  const [isAddingAttribute, setIsAddingAttribute] = React.useState(false);
  const [newAttributeKey, setNewAttributeKey] = React.useState("");
  const [newAttributeValue, setNewAttributeValue] = React.useState("");

  const [newQualifierName, setNewQualifierName] = React.useState("");

  const id = fact?.id;
  const type = fact?.type;
  const date = fact?.date?.original;
  const place = fact?.place?.original;
  const value = fact?.value;
  const qualifiers = fact?.qualifiers;
  const primary = fact?.primary;
  const factAttributeElements = [];
  const presentAttributes = ["primary", "id"];

  factAttributeElements.push(
    <PrimaryFactSwitchItem
      key={`fact-primary`}
      attributeData={{ key: FACT_KEYS.primary, id: id, value: primary }}
      fact={fact}
      factIndex={factIndex}
      parentObject={parentObject}
      parentObjectIndex={parentObjectIndex}
      updateData={updateData}
    />
  );

  if (type) {
    const attributeData = { key: FACT_KEYS.type, id: id, value: type };
    factAttributeElements.push(
      <EditableFactAttribute
        key={`fact-${attributeData.key}`}
        attributeData={attributeData}
        fact={fact}
        factIndex={factIndex}
        parentObject={parentObject}
        parentObjectIndex={parentObjectIndex}
        comparingTo={comparingTo}
        updateData={updateData}
        factTypes={factTypes}
      />
    );
    presentAttributes.push(FACT_KEYS.type);
  }

  if (date) {
    const attributeData = { key: FACT_KEYS.date, id: id, value: date };
    factAttributeElements.push(
      <EditableFactAttribute
        key={`fact-${attributeData.key}`}
        attributeData={attributeData}
        fact={fact}
        factIndex={factIndex}
        parentObject={parentObject}
        parentObjectIndex={parentObjectIndex}
        comparingTo={comparingTo}
        updateData={updateData}
        factTypes={factTypes}
      />
    );
    presentAttributes.push(FACT_KEYS.date);
  }

  if (place) {
    const attributeData = { key: FACT_KEYS.place, id: id, value: place };
    factAttributeElements.push(
      <EditableFactAttribute
        key={`fact-${attributeData.key}`}
        attributeData={attributeData}
        fact={fact}
        factIndex={factIndex}
        parentObject={parentObject}
        parentObjectIndex={parentObjectIndex}
        comparingTo={comparingTo}
        updateData={updateData}
        factTypes={factTypes}
      />
    );
    presentAttributes.push(FACT_KEYS.place);
  }

  if (value) {
    const attributeData = { key: FACT_KEYS.value, id: id, value: value };
    factAttributeElements.push(
      <EditableFactAttribute
        key={`fact-${attributeData.key}`}
        attributeData={attributeData}
        fact={fact}
        factIndex={factIndex}
        parentObject={parentObject}
        parentObjectIndex={parentObjectIndex}
        comparingTo={comparingTo}
        updateData={updateData}
        factTypes={factTypes}
      />
    );
    presentAttributes.push(FACT_KEYS.value);
  }

  if (qualifiers) {
    qualifiers.forEach((qualifier, index) => {
      const attributeData = {
        key: FACT_KEYS.qualifiers,
        id: id,
        qualifier: qualifier,
      };
      factAttributeElements.push(
        <EditableFactQualifier
          key={`qualifier-${index}`}
          attributeData={attributeData}
          qualifierIndex={index}
          fact={fact}
          factIndex={factIndex}
          parentObject={parentObject}
          parentObjectIndex={parentObjectIndex}
          comparingTo={comparingTo}
          updateData={updateData}
        />
      );
      presentAttributes.push(FACT_KEYS.qualifiers);
    });
  }

  function handleSaveNewAttribute() {
    setIsAddingAttribute(false);
    if (newAttributeValue === "") {
      return;
    }
    if (
      newAttributeKey === FACT_KEYS.type ||
      newAttributeKey === FACT_KEYS.value
    ) {
      fact[newAttributeKey] = newAttributeValue;
    } else if (
      newAttributeKey === FACT_KEYS.date ||
      newAttributeKey === FACT_KEYS.place
    ) {
      fact[newAttributeKey] = { original: newAttributeValue };
    } else if (newAttributeKey === FACT_KEYS.qualifiers) {
      fact[newAttributeKey] = [
        { name: newQualifierName, value: newAttributeValue.toString() },
      ];
    }
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
    setNewAttributeKey("");
  }

  function handleAddFactAttribute() {
    setIsAddingAttribute(true);
  }

  function editingComponent(newAttributeKey) {
    if (newAttributeKey === FACT_KEYS.qualifiers) {
      return (
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={3}>
            <FormControl>
              <Select
                value={newQualifierName}
                onChange={(_, newValue) => setNewQualifierName(newValue)}
                size="sm"
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
            </FormControl>
          </Grid>
          <Grid xs={9}>
            <Input
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
              fullwidth
              size="sm"
            />
          </Grid>
        </Grid>
      );
    } else if (newAttributeKey === FACT_KEYS.type) {
      return (
        <FormControl>
          <Select
            key="type-input"
            value={newAttributeValue}
            onChange={(_, newValue) => setNewAttributeValue(newValue)}
            size="sm"
          >
            {Object.keys(factTypes).map((t) => (
              <Option key={`type-input-${t}`} value={factTypes[t]}>
                {t}
              </Option>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <Input
          value={newAttributeValue}
          onChange={(e) => setNewAttributeValue(e.target.value)}
          fullwidth
          size="sm"
        />
      );
    }
  }

  const addAttributeItem = isAddingAttribute ? (
    <Box key={`fact-${factIndex}-add-attribute`}>
      <Grid container spacing={1} alignItems="center">
        <Grid xs>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl>
              <Select
                placeholder="Select fact type..."
                value={newAttributeKey}
                onChange={(_, newValue) => setNewAttributeKey(newValue)}
                size="sm"
              >
                {getMissingAttributes(presentAttributes).map((a, idx) => (
                  <Option key={`attribute-option-${idx}`} value={a}>
                    {a.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Option>
                ))}
              </Select>
            </FormControl>
            {editingComponent(newAttributeKey)}
          </Stack>
        </Grid>
        <Grid>
          <Tooltip title="Cancel" arrow>
            <IconButton onClick={() => setIsAddingAttribute(false)}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save" arrow>
            <IconButton onClick={handleSaveNewAttribute}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Button
      variant="plain"
      onClick={handleAddFactAttribute}
      startDecorator={<AddIcon />}
    >
      Add Fact Attribute
    </Button>
  );

  return (
    <>
      <Stack spacing={1}>
        {factAttributeElements}
        {getMissingAttributes(presentAttributes).length > 0 && addAttributeItem}
      </Stack>
    </>
  );
}

EditableFact.propTypes = {
  fact: PropTypes.object.isRequired,
  factIndex: PropTypes.number.isRequired,
  parentObject: PropTypes.object.isRequired,
  parentObjectIndex: PropTypes.number.isRequired,
  comparingTo: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
  factTypes: PropTypes.object.isRequired,
};
