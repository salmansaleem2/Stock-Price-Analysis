import { render, screen, fireEvent } from "@testing-library/react";
import StockForm from "../StockForm";

describe("StockForm", () => {
  it("renders the form and submits correctly", () => {
    render(<StockForm />);

    // Check if the form elements are present
    expect(screen.getByText("Stock Price Analysis")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Tickers:")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date:")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date:")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Analyze"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
