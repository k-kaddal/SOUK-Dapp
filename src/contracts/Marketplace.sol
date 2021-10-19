pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "SOUK Marketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        
        // Require a valid name and valid price
        require(bytes(_name).length > 0);
        require(_price > 0); 

        // increment product count
        productCount++;

        // create a product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);

        // trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];

        // Fetch the owner
        address payable _seller = _product.owner;
        
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require the product has not been purchased already
        require(!_product.purchased);
        // Require the buyer is not the seller
        require(_seller != msg.sender);

        // Purchase the product, transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them ether
        address(_seller).transfer(msg.value);

        // Trigger event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }

}
