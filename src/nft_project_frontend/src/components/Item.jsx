import React, { useEffect, useState } from "react";
// import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { nft_project_backend } from "../../../declarations/nft_project_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {

    // getting all the data from the nft.mo functions as an arguments to try mint the nft to our database
    // we have  created different hooks and taking input from props from nft.mo file
    // we converted the data fromatted into different types in .mo file to appropriate in this file
    // we also url encoded the image we are getting in the Blob format into png format so that it can be seen by us
    // then we setted the hooks and use in the html code

    const [name,setName] = useState();
    const [owner,setOwner] = useState();
    const [image,setImage] = useState();
    const [button, setButton] = useState();
    const [priceInput, setPriceInput] = useState();
    const [loaderHidden, setLoaderHidden] = useState(true);
    const [blur, setBlur] = useState();
    const [sellStatus, setSellStatus] = useState("");
    const [priceLabel, setPriceLabel] = useState();

    const id = props.id;

    const localhost = "http://localhost:8080/";

    const agent = new HttpAgent({host:localhost});

    // When deploying, we have to remove below line
    agent.fetchRootKey();

    let NFTActor;

    async function loadNFT() {
        NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: id,
        });

        const name = await NFTActor.getName();
        const owner = await NFTActor.getOwner();
        const imageData = await NFTActor.getAsset();
        const imageContent = new Uint8Array(imageData);
        const image = URL.createObjectURL(new Blob([imageContent.buffer],{type: "image/png"}));
        setName(name);
        setOwner(owner.toText());
        setImage(image);

        if(props.role == "collection")
        {
        const nftIsListed = await nft_project_backend.isListed(props.id);

        if(nftIsListed)
        {
          setOwner("NFT");
          setBlur({filter:"blur(4px)"});
          sellStatus("Listed");
        }
        else
        {
          setButton(<Button handleClick={handleSell} text={"Sell"}/>);
        }
      }
      else if(props.role == "discover")
      {
        const originalOwner = await nft_project_backend.getOriginalOwner(props.id);
        if(originalOwner.toText() != CURRENT_USER_ID.toText()){
          setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
        }

        const price = await nft_project_backend.getListingPrice(props.id);
        setPriceLabel(<PriceLabel sellPrice={price.toString()}/>)

      }
    }

    useEffect(() => {
        loadNFT();
    }, []);

    let price;
    function handleSell() {
      console.log("Sell Clicked!");
      setPriceInput(
        <input placeholder="Price in DANG" type="number" className="price-input" value={price} onChange={(e) => price=e.target.value}/>
      );
      setButton(<Button handleClick={sellItem} text={"confirm"}/>);
    }

    async function sellItem() {
      setBlur({filter:"blur(4px)"});
      setLoaderHidden(false);
      console.log("Confirm Clicked!");
      const listingResult = await nft_project_backend.listItem(props.id, Number(price));
      console.log("listing "+ listingResult);
      if(listingResult == "Success")
      {
        const projectid = await nft_project_backend.getCanisterId();
        const transferResult = await NFTActor.transferOwnership(projectid);
        console.log("transfer: "+transferResult);
        if(transferResult == "Success") 
        {
          setLoaderHidden(true);
          setButton();
          setPriceInput();
          setOwner("NFT");
          setSellStatus("Listed");
        }
      }
    };

    async function handleBuy()
    {
      console.log("Buy was triggered");
    } 

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
        <div className="disCardContent-root">
          {/* <PriceLabel/> */}
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name} <span className="purple-text">{sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
