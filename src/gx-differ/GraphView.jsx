import PropTypes from "prop-types";
import React from "react";
import { Alert, Box, useTheme } from "@mui/joy";

export default function GraphView({ gx }) {
  const theme = useTheme();
  const gxRef = React.useRef();
  const [alert, setAlert] = React.useState("");

  React.useEffect(() => {
    if (gx) {
      try {
        const graph = new window.RelationshipGraph(gx);
        new window.RelChartBuilder(
          graph,
          window.$(gxRef.current),
          new window.ChartOptions({
            shouldShowConfidence: false,
            shouldDisplayIds: false,
          })
        ).buildChart();
      } catch (e) {
        console.error("Error creating GedcomX graph:", e);
        setAlert("Error creating GedcomX graph. See console for details");
      }
    }
  }, [gx]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "auto",
        overflowX: "auto",
        padding: 1,
      }}
    >
      <Box
        ref={gxRef}
        sx={{
          "& .altName": {
            color: theme.palette.name.altName,
          },
          "& .prefix": {
            color: theme.palette.name.prefix,
          },
          "& .given": {
            color: theme.palette.name.given,
          },
          "& .surname": {
            color: theme.palette.name.surname,
          },
          "& .suffix": {
            color: theme.palette.name.suffix,
          },
          "& .fact": {
            color: theme.palette.fact.color,
          },
          "& .factType": {
            color: theme.palette.factType.color,
            fontWeight: "bold",
          },
          '& [class^="personNode"]': {
            background: theme.vars.palette.background.level1,
            border: `1px solid ${theme.vars.palette.neutral[200]}`,
            borderRadius: 4,
            boxShadow: "none",
            padding: "0 6px 0 6px",
          },
          '& [class^="personNode gender-F"]': {
            background: theme.palette.personNodeFemale.background,
            border: theme.palette.personNodeFemale.border,
          },
          '& [class^="personNode gender-M"]': {
            background: theme.palette.personNodeMale.background,
            border: theme.palette.personNodeMale.border,
          },
          '& [class$="principalPerson"]': {
            border: `2px solid ${theme.vars.palette.neutral[400]}`,
          },
          "& .isPrincipal": {
            color: theme.palette.isPrincipal.color,
            right: -1,
          },
          "& .gender-image": {
            display: "none",
          },
        }}
      />
      {alert !== "" && (
        <Alert color="danger" onClose={() => setAlert("")}>
          {alert}
        </Alert>
      )}
    </Box>
  );
}

GraphView.propTypes = {
  gx: PropTypes.object.isRequired,
};
