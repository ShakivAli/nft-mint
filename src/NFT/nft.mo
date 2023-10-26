// import Debug "mo:base/Debug";
// import Principal "mo:base/Principal";
// //actor class to create programitacally
// //Nat8 means images data is stores in array of 8 bits of natural number 
// actor class NFT(name:Text,owner:Principal,content:[Nat8])=this{
//     private let itemName=name;
//     private var nftOwner=owner;
//     private let imageBytes=content;

//     public query func getName():async Text{
//         return name;
//     };
//     public query func getOwner():async Principal{
//         return owner;
//     };
//     public query func getAsset():async [Nat8]{
//         return imageBytes;
//     };
//     // get nft canister id
//     public query func getCanisterId():async Principal{
//         return Principal.fromActor(this);
//     };
//     //function to transfer ownership on call of owner
//     public shared(msg) func transferOwnership(newOwner:Principal):async Text{
//         if(nftOwner == msg.caller ){
//             nftOwner:= newOwner;
//             return "Success";
//         }
//         else{
//             return "Transfer Error: not initiated by owner";
//         }
//     };
// };

import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name:Text, owner:Principal, content:[Nat8]) = this {
    // Debug.print("It Works!");
    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };
    
    public query func getAsset() : async [Nat8] {
        return imageBytes;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transfeOwnership(newOwner: Principal) : async Text {
        if(msg.caller == nftOwner)
        {
            nftOwner := newOwner;
            return "Success!";
        }
        else
        {
            return "Error: Not initiated by NFT owner"
        }
    }
};