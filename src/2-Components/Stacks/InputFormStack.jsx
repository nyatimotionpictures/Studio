import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const SingleWrapper = styled(Box)({
  display: "flex",
});

export const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  gap: "4px",
  "&& input": {
    height: "43px",
    background: "#36323e",
    border: "1px solid rgba(238, 241, 244, 0.3)",
    borderRadius: "6px",
    textIndent: "10px"
  },
});
