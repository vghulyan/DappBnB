import React from "react";
import { Box, Button } from "@mui/material";

const PaginationControls = ({
  page,
  pageSize,
  totalItems,
  handlePreviousPage,
  handleNextPage,
  handlePageSelect,
}) => {
  const maxPage = Math.ceil(totalItems / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === page ? "contained" : "outlined"}
          color={i === page ? "primary" : "default"}
          onClick={() => handlePageSelect(i)}
          sx={{ mx: 0.5 }}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {page > 1 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousPage}
          sx={{ mx: 1 }}
        >
          Previous
        </Button>
      )}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {renderPageNumbers()}
      </Box>
      {page < maxPage && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          sx={{ mx: 1 }}
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export default PaginationControls;
