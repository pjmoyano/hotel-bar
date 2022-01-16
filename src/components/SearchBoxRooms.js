import React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { getVentasByRoom, sortVentas } from '../utils/UtilsVenta';

const SearchBoxRooms = (props) => {
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
      options={props.rooms}
      getOptionLabel={option => option.numero}
      onChange={(event, value) => {
        if (value !== '' && value?.numero ) {
        props.onChangeRoom(value);
        console.log(value.numero);
        let ventasOrdenadas = sortVentas(getVentasByRoom(value.numero, props?.ventas)); 
        props.setFilasTabla(ventasOrdenadas);
        props?.setVistas();
      }
      }}
      renderInput={params => (
        <TextField
          {...params}
          InputLabelProps={{ classes: styleClasses }}
          label={
            "Seleziona la stanza"
          }
          variant="outlined"
          style = {{width: 200, marginRight: 10}}
        />
      )}
    />
  );
}

export default SearchBoxRooms;