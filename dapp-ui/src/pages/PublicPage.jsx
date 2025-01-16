import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { useStateContext } from "../context/StateContextProvider";
import NoData from "../components/atoms/NoData";
import PropertySummaryCard from "../components/organisms/PropertySummaryCard";
import PaginationControls from "../components/molecules/PaginationControls";
import { DAPP_BnB } from "../context/contracts";
// import { getElementAtPosition } from "../utils/utils";

const PublicPage = () => {
  const { useGetReadContract, globalVars, useAccount } = useStateContext();
  const { address } = useAccount();
  const { dappBnB_getAdminSettings } = globalVars;
  console.log("admin settings... ", dappBnB_getAdminSettings);

  const [page, setPage] = useState(1);
  // const _pageSize = getElementAtPosition(globalVars, 2);
  const [pageSize, setPageSize] = useState(
    Number(dappBnB_getAdminSettings?.pageSize) ?? 10
  );
  console.log("page size: ", pageSize);

  const user = address || "0x0000000000000000000000000000000000000000";
  const { data, isLoading, error } = useGetReadContract(
    DAPP_BnB,
    "getProperties",
    [user, page - 1, pageSize]
  );

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageSelect = (pageNum) => {
    setPage(pageNum);
  };

  const totalItems = data?.length || 0;
  // console.log(data);
  return (
    <Container>
      <Grid container spacing={3}>
        {isLoading && <Box>Loading...</Box>}
        {/* {error && <Box>Error: {error.message}</Box>} */}
        {data && data?.length > 0 ? (
          data?.map((property, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PropertySummaryCard
                {...property}
                myProperty={address === property?.owner}
              />
            </Grid>
          ))
        ) : (
          <NoData message="No Properties yet" />
        )}
      </Grid>
      <PaginationControls
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handlePageSelect={handlePageSelect}
      />
    </Container>
  );
};

export default PublicPage;
