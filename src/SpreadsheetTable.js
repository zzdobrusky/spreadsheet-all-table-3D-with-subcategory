import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import "./styles.css";

const categories = [
  {
    FundCategoryName: "Global 1",
    FundCategoryId: 1,
    Funds: [
      {
        FundName: "fund 1",
        FundSubCategoryName: "Subcategory Global 1",
        FundSubCategoryId: 1,
        AgeBrackets: [
          { BracketName: "bracket 1", Percentage: 3 },
          { BracketName: "bracket 2", Percentage: 3 },
          { BracketName: "bracket 3", Percentage: 3 }
        ]
      },
      {
        FundName: "fund 2",
        FundSubCategoryName: "Subcategory Global 1",
        FundSubCategoryId: 1,
        AgeBrackets: [
          { BracketName: "bracket 1", Percentage: 3 },
          { BracketName: "bracket 2", Percentage: 3 },
          { BracketName: "bracket 3", Percentage: 3 }
        ]
      }
    ]
  },
  {
    FundCategoryName: "Global 2",
    FundCategoryId: 2,
    Funds: [
      {
        FundName: "fund 3",
        FundSubCategoryName: "",
        FundSubCategoryId: 0,
        AgeBrackets: [
          { BracketName: "bracket 1", Percentage: 3 },
          { BracketName: "bracket 2", Percentage: 3 },
          { BracketName: "bracket 3", Percentage: 3 }
        ]
      },
      {
        FundName: "fund 4",
        FundSubCategoryName: "Subcategory Global 2",
        FundSubCategoryId: 3,
        AgeBrackets: [
          { BracketName: "bracket 1", Percentage: 3 },
          { BracketName: "bracket 2", Percentage: 3 },
          { BracketName: "bracket 3", Percentage: 3 }
        ]
      }
    ]
  },
  {
    FundCategoryName: "Global 3",
    FundCategoryId: 3,
    Funds: [
      {
        FundName: "fund 5",
        FundSubCategoryName: "Subcategory Global 3",
        FundSubCategoryId: 5,
        AgeBrackets: [
          { BracketName: "bracket 1", Percentage: 3 },
          { BracketName: "bracket 2", Percentage: 3 },
          { BracketName: "bracket 3", Percentage: 3 }
        ]
      }
    ]
  }
];

export default class SpreadsheetTable extends Component {
  bracketNames = categories[0].Funds[0].AgeBrackets.map(
    (bracket) => bracket.BracketName
  );

  initializeAssetValuesMatrix = (categories) => {
    return categories.map((category) =>
      category.Funds.map((fund) =>
        fund.AgeBrackets.map((bracket) => bracket.Percentage)
      )
    );
  };

  initializeCategoriesToShow = (categories) =>
    categories.map((category) => true);

  initializeErrorIndices = (brackets) => brackets.map((bracket) => -1);

  state = {
    categoriesValuesMatrix: this.initializeAssetValuesMatrix(categories),
    categoriesToShow: this.initializeCategoriesToShow(categories),
    bracketError: "",
    bracketErrorIndices: this.initializeErrorIndices(this.bracketNames)
  };

  bracketHasError = (categoryIndex, fundIndex, bracketIndex) => {
    console.log(
      "this.state.bracketErrorIndices.includes(-1): ",
      this.state.bracketErrorIndices.includes(-1)
    );
    return (
      categoryIndex === this.state.bracketErrorIndices[0] &&
      fundIndex === this.state.bracketErrorIndices[1] &&
      bracketIndex === this.state.bracketErrorIndices[2] &&
      !this.state.bracketErrorIndices.includes(-1)
    );
  };

  onBlurHandler = (categoryIndex, fundIndex, bracketIndex) => {
    console.log(
      `categoryIndex: ${categoryIndex}, fundIndex: ${fundIndex}, bracketIndex: ${bracketIndex}`
    );
    const updatedCategoriesValuesMatrix = this.state.categoriesValuesMatrix;
    if (
      this.bracketHasError(categoryIndex, fundIndex, bracketIndex) ||
      isNaN(
        updatedCategoriesValuesMatrix[categoryIndex][fundIndex][bracketIndex]
      )
    ) {
      updatedCategoriesValuesMatrix[categoryIndex][fundIndex][bracketIndex] = 0;
      this.setState({
        categoriesValuesMatrix: updatedCategoriesValuesMatrix,
        bracketErrorIndices: [-1, -1, -1]
      });
    }
  };

  onBracketValueChangeHandler = (
    value,
    categoryIndex,
    fundIndex,
    bracketIndex
  ) => {
    console.log(
      `value: ${value}, fundIndex: ${fundIndex}, bracketIndex: ${bracketIndex}, categoryIndex: ${categoryIndex}`
    );
    const updatedCategoriesValuesMatrix = this.state.categoriesValuesMatrix;
    value = parseInt(value, 10);
    updatedCategoriesValuesMatrix[categoryIndex][fundIndex][
      bracketIndex
    ] = value;
    const updatedBracketErrorIndices =
      value < 0 || value > 100
        ? [categoryIndex, fundIndex, bracketIndex]
        : [-1, -1, -1];
    this.setState({
      categoriesValuesMatrix: updatedCategoriesValuesMatrix,
      bracketErrorIndices: updatedBracketErrorIndices
    });
  };

  onCategoryClickHandler = (categoryIndex) => {
    console.log("categoryIndex: ", categoryIndex);
    const updatedCategoriesToHide = this.state.categoriesToShow;
    updatedCategoriesToHide[categoryIndex] = !updatedCategoriesToHide[
      categoryIndex
    ];
    this.setState({ categoriesToShow: updatedCategoriesToHide });
  };

  calculateCategoryColumnTotal = (
    categoriesValuesMatrix,
    categoryIndex,
    bracketIndex
  ) => {
    const category = categoriesValuesMatrix[categoryIndex];
    return category.reduce((sum, bracketValues) => {
      const bracketValue = isNaN(bracketValues[bracketIndex])
        ? 0
        : bracketValues[bracketIndex];
      return sum + bracketValue;
    }, 0);
  };

  calculateAllAssetsColumnTotal = (categoriesValuesMatrix, bracketIndex) => {
    return categoriesValuesMatrix.reduce(
      (sum, category, categoryIndex) =>
        sum +
        this.calculateCategoryColumnTotal(
          categoriesValuesMatrix,
          categoryIndex,
          bracketIndex
        ),
      0
    );
  };

  renderBracketHeaders = (bracketNames) =>
    bracketNames.map((bracketName) => {
      return <th>{bracketName}</th>;
    });

  renderSubtotalValues = (categoriesValuesMatrix, categoryIndex) => {
    return this.bracketNames.map((bracket, bracketIndex) => {
      return (
        <td key={`totals_${bracketIndex}_${categoryIndex}`} className="totals">
          {this.calculateCategoryColumnTotal(
            categoriesValuesMatrix,
            categoryIndex,
            bracketIndex
          )}
        </td>
      );
    });
  };

  renderTotalValues = (categoriesValuesMatrix) =>
    this.bracketNames.map((bracket, bracketIndex) => (
      <td key={`category_totals_${bracketIndex}`} className="totals">
        {this.calculateAllAssetsColumnTotal(
          categoriesValuesMatrix,
          bracketIndex
        )}
      </td>
    ));

  renderBracketValues = (
    brackets,
    fundIndex,
    categoryIndex,
    bracketErrorIndices
  ) => {
    console.log("categoryIndex: ", categoryIndex);
    return brackets.map((bracket, bracketIndex) => {
      const bracketHasError = this.bracketHasError(
        categoryIndex,
        fundIndex,
        bracketIndex
      );
      const bracketError = bracketHasError ? "Error" : "";
      return (
        <td key={`bracket_${fundIndex}_${bracketIndex}`}>
          <TextField
            error={Boolean(bracketError)}
            id="outlined-number"
            label=""
            type="number"
            inputProps={{ min: "0", max: "100" }}
            // style={{ minWidth: "40px" }}
            variant="outlined"
            // InputLabelProps={{
            //   shrink: true
            // }}
            fullWidth
            onChange={(e) =>
              this.onBracketValueChangeHandler(
                e.target.value,
                categoryIndex,
                fundIndex,
                bracketIndex
              )
            }
            onBlur={() =>
              this.onBlurHandler(categoryIndex, fundIndex, bracketIndex)
            }
            value={
              this.state.categoriesValuesMatrix[categoryIndex][fundIndex][
                bracketIndex
              ]
            }
            helperText={bracketError}
          />
        </td>
      );
    });
  };

  renderFunds = (funds, categoryIndex, bracketErrorIndices) => {
    console.log("categoryIndex: ", categoryIndex);
    let previousFundSubCategoryId = 0;
    const toHideClass =
      this.state.categoryIndexToHide === categoryIndex ? "hideFundRow" : "";
    return funds.map((fund, fundIndex) => {
      const isNewSubAssetId =
        fund.FundSubCategoryId !== previousFundSubCategoryId;
      if (isNewSubAssetId) previousFundSubCategoryId = fund.FundSubCategoryId;
      const rows = [];
      if (isNewSubAssetId)
        rows.push(
          <tr
            key={`subasset_${fund.FundSubCategoryName}_${fundIndex}`}
            className={`label ${toHideClass}`}
          >
            <td colSpan="100%">{fund.FundSubCategoryName}</td>
          </tr>
        );
      rows.push(
        <tr key={`fund_${fundIndex}_${categoryIndex}`}>
          <td key={`fundLabel`} className="label">
            {fund.FundName}
          </td>
          {this.renderBracketValues(
            fund.AgeBrackets,
            fundIndex,
            categoryIndex,
            bracketErrorIndices
          )}
        </tr>
      );
      return rows;
    });
  };

  renderCategories = (
    categories,
    categoriesValuesMatrix,
    categoriesToShow,
    bracketErrorIndices
  ) => {
    const rows = [];
    categories.forEach((category, categoryIndex) => {
      rows.push(
        <tr
          key={`asset_${category.FundCategoryName}_${categoryIndex}`}
          onClick={() => this.onCategoryClickHandler(categoryIndex)}
          className="categoryLabel"
        >
          <td colSpan="100%">
            <div className="categoryLabelContent">
              <div>{category.FundCategoryName}</div>
              <div>
                {categoriesToShow[categoryIndex] ? (
                  <ExpandMoreIcon />
                ) : (
                  <ExpandLessIcon />
                )}
              </div>
            </div>
          </td>
        </tr>
      );
      if (categoriesToShow[categoryIndex])
        rows.push(
          this.renderFunds(category.Funds, categoryIndex, bracketErrorIndices)
        );
      rows.push(
        <tr className="subtotal">
          <td>Subtotal for {category.FundCategoryName}</td>
          {this.renderSubtotalValues(categoriesValuesMatrix, categoryIndex)}
        </tr>
      );
    });
    return rows;
  };

  componentDidMount() {
    // this.initializeAssetValuesMatrix(categories);
  }

  render() {
    return (
      <div className="App">
        <h1>Spreadsheet like table</h1>
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                {this.renderBracketHeaders(this.bracketNames)}
              </tr>
            </thead>

            <tbody>
              {this.renderCategories(
                categories,
                this.state.categoriesValuesMatrix,
                this.state.categoriesToShow,
                this.state.bracketErrorIndices
              )}
            </tbody>

            <tfoot>
              <tr className="total">
                <td key="asset_total_label">Total</td>
                {this.renderTotalValues(this.state.categoriesValuesMatrix)}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}
