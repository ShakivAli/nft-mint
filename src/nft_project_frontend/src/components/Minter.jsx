import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { nft_project_backend } from "../../../declarations/nft_project_backend";
import { Principal } from "@dfinity/principal";
import Item from "./Item";

function Minter() {

    // registering the form so that when the user uploads on the form the data, we can easily get the same
    const {register, handleSubmit} = useForm();
    const [nftprincipal, setNFTprincipal] = useState("");
    const [loaderHidden, setLoaderHidden] = useState(true);

    // what are the things which will get register when the user click on the submit button of the form
    async function onSubmit(data) {
        // console.log(data.image);
        setLoaderHidden(false);
        const name = data.name;
        const image = data.image[0];
        const imageByteData = [...new Uint8Array(await image.arrayBuffer())];

        const newNFTID = await nft_project_backend.mint(imageByteData, name);
        console.log(newNFTID.toText());        // canister id of the new user
        setNFTprincipal(newNFTID);           // set the new nft principal by this hook (same we are printing in above statement, also same we have stored in id in app.jsx)
        setLoaderHidden(true);
    }

  if (nftprincipal == "")
  {
  return (
    <div className="minter-container">
      <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Create NFT
      </h3>
      <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
        Upload Image
      </h6>
      <form className="makeStyles-form-109" noValidate="" autoComplete="off">
        <div className="upload-container">
          <input
            {...register("image", {required: true})}
            className="upload"
            type="file"
            accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
          />
        </div>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Collection Name
        </h6>
        <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
          <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
            <input
            {...register("name", {required: true})}
              placeholder="e.g. CryptoDunks"
              type="text"
              className="form-InputBase-input form-OutlinedInput-input"
            />
            <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
          </div>
        </div>
        <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
          <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">Mint NFT</span>
        </div>
      </form>
    </div>
  );
  }
  else
  {
    return (
    <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
            Minted!
        </h3>
        <div className="horizontal-center">
            <Item id={nftprincipal.toText()}/>
        </div>
    </div>
    );
  }
}

export default Minter;
