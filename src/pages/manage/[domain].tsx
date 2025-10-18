import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Divider,
  TextField,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { formatDate, primaryColor } from "@/utils/helpers";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ArrowDropDown,
  ArrowDropDownCircleOutlined,
} from "@mui/icons-material";

const Manage = () => {
  const router = useRouter();
  const { domain: domainName, uuid } = router.query;
  const [selectedOption, setSelectedOption] = useState("option1");
  const [dnsRecord, setDnsRecord] = useState({
    type: "",
    name: "",
    value: "",
    ttl: 300,
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [recordList, setRecordList] = useState<any>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [recordUuid, setRecordUuid] = useState("");
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [dialogFormData, setDialogFormData] = useState({
    type: "",
    name: "",
    value: "",
    ttl: 300,
  });

  console.log("uuid", uuid);

  const options = [
    { id: "option1", name: "DNS Records" },
    // { id: "option2", name: "Update DNS Recordsu" },
    // { id: "option1", name: "DNS Records" },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setDnsRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    if (
      dnsRecord.type != "" &&
      dnsRecord.name != "" &&
      dnsRecord.value != "" &&
      dnsRecord.ttl
    ) {
      console.log("first");
      setLoading(true);
      e.preventDefault();

      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/freename/records?zone=${uuid}`,
          [dnsRecord]
        );
        console.log("response", response);
        if (response?.data?.message) {
          toast.success(`${response?.data?.message}`, {
            position: "top-right",
            style: {
              top: "120px", // Adjusts the position slightly above the bottom
            },
          });
          const newRecord = response?.data?.data;
          setRecordList((prevList: any) => [...newRecord, ...prevList]);
        }
      } catch (error) {
        console.error(" failed:", error);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "An unknown error occurred";
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
        //   throw error;
      }
      setLoading(false);
      console.log("DNS Record Submitted:", dnsRecord);
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
      console.log("uuid", uuid);
      setIsFetching(true);
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/freename/records/${uuid}`
        );
        console.log("response", response);
        setRecordList(response?.data?.data);
        // if (response?.data?.message) {
        //   toast.success(`${response?.data?.message}`);
        // }
      } catch (error) {
        console.error(" failed:", error);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "An unknown error occurred";
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
        //   throw error;
      }
      setIsFetching(false);
    };
    if (uuid) {
      fetchRecords();
    }
  }, [uuid]);

  const onUpdate = async (dialogFormData: any) => {
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/freename/records?record=${recordUuid}`,
        {
          name: dialogFormData.name,
          value: dialogFormData.value,
          ttl: dialogFormData.ttl,
        }
      );
      console.log("response", response);

      if (response?.data?.message) {
        toast.success(`${response?.data?.message}`, {
          position: "top-right",
          style: {
            top: "120px", // Adjusts the position slightly above the bottom
          },
        });
      }
      setRecordList((prevList: any) =>
        prevList.map((record: any) =>
          record.uuid === recordUuid ? { ...record, ...dialogFormData } : record
        )
      );

      //update the recordList specific id data
    } catch (error) {
      console.error(" failed:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
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
      //   throw error;
    }
    setIsUpdating(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    // setSelectedRecord(null);
  };

  const handleDialogInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDialogFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDialogSubmit = async () => {
    try {
      // Submit the updated data (API call here)
      console.log("Dialog Form Data on Submit:", dialogFormData);
      onUpdate(dialogFormData);

      setOpenDialog(false);
      setDialogFormData({
        type: "",
        name: "",
        value: "",
        ttl: 300,
      });

      // Do something with the form data (e.g., call your API)
    } catch (error) {
      console.error("Error submitting dialog form:", error);
    }
  };

  const [open, setOpen] = useState(false);

  const handleIconClick = () => {
    setOpen((prevOpen) => !prevOpen); // Toggles dropdown open/close state
  };

  console.log(
    "currentRecord",
    isUpdating,
    "1",
    dialogFormData.type,
    "2",
    currentRecord.type,

    dialogFormData.name === currentRecord.name &&
      dialogFormData.value === currentRecord.value &&
      dialogFormData.ttl === currentRecord.ttl
  );

  useEffect(() => {
    if (openDialog) {
      setDialogFormData({
        type: currentRecord?.type || "",
        name: currentRecord?.name || "",
        value: currentRecord?.value || "",
        ttl: currentRecord?.ttl || "",
      });
    }
  }, [openDialog, currentRecord]);

  return (
    <Layout isFooter={false}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        height={{ xs: "auto", md: "100vh" }}
        paddingTop={{ xs: "150px", md: "150px" }}
        paddingLeft={{ md: "32px" }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "250px" },
            // backgroundColor: "#f5f5f5",
            // backgroundColor: "#fff",
            padding: 2,
            overflowY: "auto",
            borderRadius: "8px",
            border: "1px solid #fff",
          }}
        >
          {/* <Divider sx={{ my: 2 }} /> */}
          <List>
            {options.map((option) => (
              <ListItem
                key={option.id}
                button
                onClick={() => setSelectedOption(option.id)}
                sx={{
                  backgroundColor:
                    // "#465A7E66",
                    selectedOption === option.id ? "#6E7B99" : "465A7E66",
                  marginBottom: 1,
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#6E7B99", // Background color on hover
                  },
                }}
              >
                {option.name}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            // backgroundColor: "white",
            marginX: { xs: 0, md: 3 },
            paddingX: { xs: 2, md: 0 },
            paddingBottom: { xs: 4, md: 0 },
            // borderRadius: "8px",
            border: "1px solid #fff",
            borderRadius: "8px",
          }}
        >
          {selectedOption === "option1" && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                padding: { xs: "16px", md: "24px" },
              }}
            >
              <Typography
                variant="h5"
                // color="black"
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                Domain Name System Records
              </Typography>

              <Box
                // flexDirection={{
                //   sm: "column",
                // }}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Record Type"
                  name="type"
                  value={dnsRecord.type}
                  style={{
                    backgroundColor: "#465A7E66",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                  InputProps={{
                    style: { color: "white" }, // Changes input text color to white
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleIconClick}
                          style={{ cursor: "pointer", color: "white" }}
                        >
                          <ArrowDropDown />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Changes label text color to white
                  }}
                  onChange={handleInputChange}
                  // required
                  SelectProps={{
                    open: open,
                    onClose: () => setOpen(false),
                    onOpen: () => setOpen(true),
                    IconComponent: () => null, // Hide default dropdown arrow
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#6E7B99", // Custom background for dropdown
                        },
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="A"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    A
                  </MenuItem>
                  <MenuItem
                    value="NS"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    NS
                  </MenuItem>
                  <MenuItem
                    value="TXT"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    TXT
                  </MenuItem>
                  <MenuItem
                    value="MX"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    MX
                  </MenuItem>
                  <MenuItem
                    value="CNAME"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    CNAME
                  </MenuItem>
                  <MenuItem
                    value="URL"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    URL
                  </MenuItem>
                  <MenuItem
                    value="REDIRECT"
                    style={{
                      backgroundColor: "#6E7B99",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    REDIRECT
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={dnsRecord.name}
                  onChange={handleInputChange}
                  // required
                  style={{
                    backgroundColor: "#465A7E66",
                    color: "white !important",
                    // border: "none",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    style: { color: "white" }, // Changes input text color to white
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Changes label text color to white
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Value"
                  name="value"
                  value={dnsRecord.value}
                  onChange={handleInputChange}
                  // required
                  style={{
                    backgroundColor: "#465A7E66",
                    color: "white !important",
                    // border: "none",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                  InputProps={{
                    style: { color: "white" }, // Changes input text color to white
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Changes label text color to white
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="TTL (Time to Live)"
                  name="ttl"
                  value={dnsRecord.ttl}
                  onChange={handleInputChange}
                  // required
                  style={{
                    backgroundColor: "#465A7E66",
                    color: "white !important",
                    // border: "none",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    style: { color: "white" }, // Changes input text color to white
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Changes label text color to white
                  }}
                />
              </Box>

              <button
                // variant="contained"
                // sx={{ mt: 2, width: { xs: "100%", md: "200px" } }}
                type="submit"
                style={{
                  backgroundColor:
                    // !dnsRecord.type ||
                    // !dnsRecord.name ||
                    // !dnsRecord.value ||
                    // !dnsRecord.ttl
                    //   ? "#6E7B99"
                    //   :
                    `${primaryColor}`,
                  borderRadius: "8px",
                  fontWeight: 700,
                  // padding: "12px",
                  marginTop: 2,
                  width: "160px",

                  color: "#fff",

                  height: "50px",
                  cursor:
                    !dnsRecord.type ||
                    !dnsRecord.name ||
                    !dnsRecord.value ||
                    !dnsRecord.ttl
                      ? "no-drop" // Apply not-allowed cursor when disabled
                      : "pointer",
                }}
                disabled={
                  !dnsRecord.type ||
                  !dnsRecord.name ||
                  !dnsRecord.value ||
                  !dnsRecord.ttl
                }
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      // padding: "4px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  " Save DNS Record"
                )}
              </button>

              {/* 
here */}
              <Typography
                variant="h6"
                // color="black"
                sx={{ mt: 4, fontSize: { xs: "1.25rem", md: "1.5rem" } }}
              >
                DNS Records List
              </Typography>
            </Box>
          )}
          {isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <CircularProgress />
            </div>
          ) : recordList?.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                mt: 2,
                backgroundColor: "black",
                border: "1px solid white",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "white",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                      }}
                    >
                      Value
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                      }}
                    >
                      TTL
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                      }}
                    >
                      Created At
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recordList?.map((record: any) => (
                    <TableRow key={record?._id}>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        {record?.type}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        {record?.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        {record?.value}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        {record?.ttl}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        {formatDate(record?.createdAt)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                      >
                        <Button
                          // variant="contained"
                          // sx={{ mt: 2, width: { xs: "100%", md: "200px" } }}
                          type="submit"
                          style={{
                            backgroundColor: `${primaryColor}`,
                            borderRadius: "8px",
                            color: "#fff",
                            fontWeight: 700,
                            padding: "12px",
                            // marginTop: 2,
                            width: "100%",
                          }}
                          //   onClick={onUpdate}
                          onClick={() => {
                            setOpenDialog(true);
                            setRecordUuid(record?.uuid);
                            setCurrentRecord(record);
                            //pass uuid of specific record to dialog box so it can use in update button
                          }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                paddingX: "32px",
              }}
            >
              No DNS records found.
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "	#3D434B !important",
            borderRadius: "24px",
            padding: "24px",
            // border: "1px solid white", // Change entire dialog background color
          },
        }}
      >
        <DialogTitle
          sx={
            {
              // color: "black",
            }
          }
        >
          Update DNS Record
        </DialogTitle>
        <DialogContent color="white">
          <TextField
            margin="normal"
            fullWidth
            label="Record Type"
            name="type"
            value={dialogFormData.type}
            // {...(dialogFormData?.type != ""
            //   ? { value: dialogFormData?.type }
            //   : { defaultValue: currentRecord?.type })}
            onChange={handleDialogInputChange}
            style={{
              backgroundColor: "#465A7E66",
              color: "white !important",
              // border: "none",
              borderRadius: "8px",
            }}
            InputProps={{
              style: { color: "white" }, // Changes input text color to white
            }}
            InputLabelProps={{
              style: { color: "white" }, // Changes label text color to white
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            // {...(dialogFormData?.name != ""
            //   ? { value: dialogFormData?.name }
            //   : { defaultValue: currentRecord?.name })}
            value={dialogFormData.name}
            onChange={handleDialogInputChange}
            style={{
              backgroundColor: "#465A7E66",
              color: "white !important",
              // border: "none",
              borderRadius: "8px",
            }}
            InputProps={{
              style: { color: "white" }, // Changes input text color to white
            }}
            InputLabelProps={{
              style: { color: "white" }, // Changes label text color to white
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Value"
            name="value"
            value={dialogFormData.value}
            // {...(dialogFormData?.value != ""
            //   ? { value: dialogFormData?.value }
            //   : { defaultValue: currentRecord?.value })}
            onChange={handleDialogInputChange}
            style={{
              backgroundColor: "#465A7E66",
              color: "white !important",
              // border: "none",
              borderRadius: "8px",
            }}
            InputProps={{
              style: { color: "white" }, // Changes input text color to white
            }}
            InputLabelProps={{
              style: { color: "white" }, // Changes label text color to white
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="TTL"
            name="ttl"
            value={dialogFormData.ttl}
            // {...(dialogFormData?.ttl != 0
            //   ? { value: dialogFormData?.ttl }
            //   : { defaultValue: currentRecord?.ttl })}
            onChange={handleDialogInputChange}
            style={{
              backgroundColor: "#465A7E66",
              color: "white !important",
              // border: "none",
              borderRadius: "8px",
            }}
            InputProps={{
              style: { color: "white" }, // Changes input text color to white
            }}
            InputLabelProps={{
              style: { color: "white" }, // Changes label text color to white
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: `${primaryColor}`,
              color: "#fff",
              fontWeight: 700,
              padding: "12px",
              borderRadius: "8px",
              // height: "50px",
            }}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <button
            // variant="contained"
            onClick={handleDialogSubmit}
            disabled={
              isUpdating ||
              (dialogFormData.type === currentRecord.type &&
                dialogFormData.name === currentRecord.name &&
                dialogFormData.value === currentRecord.value &&
                dialogFormData.ttl === currentRecord.ttl)
            }
            style={{
              backgroundColor: `${primaryColor}`,
              borderRadius: "8px",
              color: "#fff",
              fontWeight: 700,
              padding: "12px",
              width: "100px",
              cursor:
                isUpdating ||
                (dialogFormData.type === currentRecord.type &&
                  dialogFormData.name === currentRecord.name &&
                  dialogFormData.value === currentRecord.value &&
                  dialogFormData.ttl === currentRecord.ttl)
                  ? "no-drop"
                  : "pointer",
              // height: "50px",
            }}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Update"}
          </button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Manage;
