import React from "react";
import { Box } from "@mui/material";

function DefaultLayout({ children }) {
    return (
        <Box>
            layout
            {children}
        </Box>
    );
}

export default DefaultLayout;
