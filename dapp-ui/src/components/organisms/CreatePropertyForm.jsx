import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Box,
  Typography,
  MenuItem,
  useMediaQuery,
  Grid,
} from "@mui/material";
import CustomButton from "../atoms/StyledButton";
import StyledDropZone from "../molecules/StyledDropZone";
import SpaceBetween from "../atoms/SpaceBetween";

const schema = z.object({
  price: z.coerce
    .number()
    .positive({ message: "Initial price must be greater than 0" })
    .refine((value) => value > 0, {
      message: "Initial price is required and must be greather than 0",
    }),
  propertyTitle: z.string().min(1, { message: "Property title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  propertyAddress: z
    .string()
    .min(10, { message: "Property address is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  rooms: z
    .number()
    .positive({ message: "Initial rooms must be greather than 0" }),
});

const categories = ["Residential", "Commercial", "Land"];

const CreatePropertyForm = ({ onSubmit, initialValues }) => {
  const [images, setImages] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const handleCancel = () => {
    reset();
    setImages([]);
  };

  const handleFilesAccepted = (acceptedFiles) => {
    setImages(acceptedFiles);
  };

  const handleFormSubmit = (data) => {
    console.log("handle form submit::: IMAGES: ", images);
    onSubmit({ ...data, imagesFormData: images });
    reset();
  };

  const isMediumUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        List a New Property
      </Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMediumUp ? "row" : "column",
            gap: 2,
          }}
        >
          {isMediumUp && (
            <Box
              sx={{
                flex: "1 1 30%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StyledDropZone onFilesAccepted={handleFilesAccepted} />
            </Box>
          )}
          <Box
            sx={{
              flex: "1 1 70%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Controller
                name="propertyTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Title"
                    error={!!errors.propertyTitle}
                    helperText={
                      errors.propertyTitle ? errors.propertyTitle.message : ""
                    }
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="propertyAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Address"
                    error={!!errors.propertyAddress}
                    helperText={
                      errors.propertyAddress
                        ? errors.propertyAddress.message
                        : ""
                    }
                    margin="normal"
                  />
                )}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Price"
                      type="number"
                      error={!!errors.price}
                      helperText={errors.price ? errors.price.message : ""}
                      margin="normal"
                    />
                  )}
                />
                <Controller
                  name="rooms"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Rooms"
                      type="number"
                      error={!!errors.rooms}
                      helperText={errors.rooms ? errors.rooms.message : ""}
                      margin="normal"
                    />
                  )}
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Category"
                      error={!!errors.category}
                      helperText={
                        errors.category ? errors.category.message : ""
                      }
                      margin="normal"
                    >
                      {categories.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                    margin="normal"
                  />
                )}
              />
              {!isMediumUp && (
                <Box sx={{ mt: 2 }}>
                  <StyledDropZone onFilesAccepted={handleFilesAccepted} />
                </Box>
              )}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <CustomButton
                type="submit"
                className="live-expo"
                direction="left"
                disabled={!isValid || isSubmitting}
              >
                List Property
              </CustomButton>
              <CustomButton
                type="button"
                className="live-expo"
                color="secondary"
                onClick={handleCancel}
                direction="right"
              >
                Cancel
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CreatePropertyForm;
