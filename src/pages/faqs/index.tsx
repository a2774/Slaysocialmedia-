import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import Layout from "@/components/layout";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Faqs = () => {
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
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                FAQS
              </Typography>

              {/* FAQ 1 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  paddingTop: "48px",
                }}
              >
                How does Singh Domains Work?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
                component="div"
              >
                <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                  <li>
                    On the Singh Platform you can build your own Web3 domain
                    ecosystem to generate passive income from royalties:
                    register the TLD you prefer (e.g. .lambo) and every time
                    someone buys a domain with your TLD (e.g. when.lambo) you
                    earn, without lifting a finger!
                  </li>
                  <li>
                    Singh Platform is the gateway to your digital identity. We
                    offer Web 3 TLDs and domains in an inexpensive and
                    convenient manner. Singh Platform also empowers users by
                    helping them generate passive income from royalties.
                  </li>
                </ul>
              </Typography>

              {/* FAQ 2 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                What is a Singh Domains TLD?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
              >
                A TLD (or top-level domain) is everything that follows the final
                dot of a domain name. For example, in the domain name ‘Singh
                Platform’, ‘.io’ is the TLD. A Top-Level Domain (TLD) is
                everything that comes after the final dot of a domain name. The
                Second Level Domain (SLD) is everything that comes before the
                dot. For example, “Singh Platform” would be the SLD, and “.io”
                would be the TLD.
              </Typography>

              {/* FAQ 3 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                What is a Royalty?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
              >
                Singh Platform royalty consists of an exclusive contract that
                allows you to generate passive income every time someone
                registers a domain on a TLD (e.g. .lambo) owned by you.
              </Typography>

              {/* FAQ 4 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                Are there Renewal Fees?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
              >
                No! Once you’ve bought a Singh Platform Domain or TLD, it’s
                yours forever, with no renewal fees ever! This is the
                significant advantage of Web 3 domain/TLD over traditional
                alternatives.
              </Typography>

              {/* FAQ 5 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                Which Chains are Supported?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
                component="div"
              >
                <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                  <li>Polygon</li>
                  <li>Cronos</li>
                  <li>Binance</li>
                </ul>
                Singh Platform plans to expand its multi-chain approach by
                adding blockchains upon which domains can be minted.
              </Typography>

              {/* FAQ 6 */}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                What are SINGH domains?
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  paddingY: "24px",
                }}
              >
                Singh Platform domains are Web3 domains (aka NFTs), which you
                can mint on the Polygon blockchain and connect to your crypto
                wallet to make transactions (e.g., send and receive
                cryptocurrencies).
              </Typography>
            </Box>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Faqs;
