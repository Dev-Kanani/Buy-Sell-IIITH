import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const TAX_RATE = 0.07;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function createRow(desc, unit) {
  return { desc, price: unit };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function CartTotal({ itemNames, itemPrices }) {
  const rows = [];

  console.log("Item names:", itemNames);
  console.log("Item prices:", itemPrices);

  for (let i = 0; i < itemNames.length; i++) {
    rows.push(createRow(itemNames[i], itemPrices[i]));
  }

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  console.log("Rows:", rows);

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 3, padding: 3 }}
      className="w-50"
    >
      <Typography variant="h4" gutterBottom align="center">
        Cart Summary
      </Typography>
      <Table aria-label="cart-table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Typography variant="h6" fontWeight="bold">
                Product Name
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" fontWeight="bold">
                Price
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Typography variant="body5" fontWeight="bold"></Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Subtotal
              </Typography>
            </TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Tax (7%)
              </Typography>
            </TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" fontWeight="bold" color="primary">
                {ccyFormat(invoiceTotal)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          Total Cart Value: {ccyFormat(invoiceTotal)}
        </Typography>
      </Box>
    </TableContainer>
  );
}
