// pages/AdminPage.tsx

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "@/components/layout";
import { formatDate, formatTime } from "@/utils/helpers";
import { usePopover } from "@/components/custom-popover";
import { useBoolean } from "@/hooks/use-boolean";
// import AddPromoterForm from "@/components/promoters/add-promoter-form";

const Admin = () => {
  const [domainsList, setDomainsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const popover = usePopover();
  const AddPromoter = useBoolean();

  useEffect(() => {
    const fetchDomains = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/freename/domainsOwned`
        );
        setDomainsList(response.data.domains);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const errorMessage =
            e.response?.data?.message || "An unknown error occurred";
          toast.error(`${errorMessage}`, {
            position: "top-right",
            style: {
              top: "120px", // Adjusts the position slightly above the bottom
            },
          });
        } else {
          toast.error("An unexpected error occurred", {
            position: "top-right",
            style: {
              top: "120px", // Adjusts the position slightly above the bottom
            },
          });
        }
      }
      setIsLoading(false);
    };

    fetchDomains();
  }, []);

  return (
    <Layout>
      <section className="banner-section Main-4">
        <div className="container">
          <div
            className="banner-wrapper"
            style={{
              paddingTop: "128px",
            }}
          >
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  popover.onClose();
                  AddPromoter.onTrue();
                }}
              >
                {/* <Box icon="material-symbols:add" width={24} /> */}
                Add Promoter
              </Button>
            </Box>
          </div>
        </div>
        {/* <AddPromoterForm
          eventId={""}
          open={AddPromoter.value}
          onClose={() => {
            AddPromoter.onFalse();
          }}
        /> */}
      </section>
    </Layout>
  );
};

export default Admin;
