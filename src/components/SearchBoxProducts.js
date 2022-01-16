import React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { ccyFormat } from '../utils/UtilsVenta';

const SearchBoxProducts = (props) => {
  const style = {
    root: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      right: "52px"
    }
  };

  const useStyles = makeStyles(() => ({
    ...style
  }));
  const styleClasses = useStyles();
  return (
    <Autocomplete
      id="combo-box-product"
      key={props.cleanAutocomplete}
      options={props.menu}
      getOptionLabel={option => "."+option?.codigo+" - "+option.nombre+" - €"+ccyFormat(option.precio * 1)}
      onChange={(event, value) => {
        if (value) {
        props.onChange(value);
      }
      }}
      renderInput={params => (
        <TextField
          {...params}
          InputLabelProps={{ classes: styleClasses }}
          label={
            "Selezionare il prodotto"
          }
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}

export default SearchBoxProducts;