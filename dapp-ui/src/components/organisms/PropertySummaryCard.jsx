import React from "react";
import { fromWei, toWei } from "../../utils/utils";
import useIPFSContent from "../../hooks/useIPFSContent";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import GradientBox from "../atoms/GradientBox";
import { formatUnits } from "viem";

const PropertySummaryCard = ({
  category,
  description,
  imageHashes,
  owner,
  price,
  productId,
  propertyAddress,
  propertyTitle,
  rooms,
  myProperty,
}) => {
  const extraStyle = {
    background: `linear-gradient(225deg, ${
      myProperty ? "#a34fde" : "#e3af0d"
    } 17%, #f9f9f9 37%, #f9f9f9 50%, #3dd6f5 72%)`,
    boxShadow: `0px 0px ${myProperty ? "30px" : "10px"}`,
  };

  const priceInEther = fromWei(price);
  const { imageURL } = useIPFSContent(imageHashes?.[0]);

  return (
    <GradientBox {...extraStyle}>
      <Card
        sx={{
          borderRadius: "10px", // Adjust to fit within the outer border
          // backgroundColor: "#1f1f1f",
          padding: "20px",
          color: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #3b3b3b",
        }}
      >
        <Link
          to={`/property/${Number(productId)}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardMedia
            component="img"
            height="140"
            image={
              imageHashes.length > 0
                ? `${imageURL}`
                : "https://via.placeholder.com/140"
            }
            alt={propertyTitle}
          />
        </Link>

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: "white" }}
          >
            {propertyTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Category:</strong> {category}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Address:</strong> {propertyAddress}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Owner:</strong> {owner}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Price:</strong> {priceInEther} ETH
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Product Id:</strong> {Number(productId)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Rooms:</strong> {formatUnits(rooms, 0)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "#999999" }}
          >
            <strong>Description:</strong> {description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6366f1",
                color: "white",
                "&:hover": { backgroundColor: "#4f46e5" },
              }}
            >
              Contact us
            </Button>
          </Box>
        </CardContent>
      </Card>
    </GradientBox>
  );
};

export default PropertySummaryCard;
