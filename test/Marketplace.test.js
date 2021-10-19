const { assert } = require("chai")
require('chai').use(require('chai-as-promised')).should()
const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider('http://localhost:7545')
const web3 = new Web3(provider)
const Marketplace = artifacts.require('./Marketplace.sol')


contract('Marketplace', ([deployer, seller, buyer])=>{
    let marketplace

    before(async()=>{
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async ()=>{
        it('deploys successfuly', async()=>{
            const address= await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
        })


        it('has a name', async() => {
            const name = await marketplace.name()
            assert.equal(name, "SOUK Marketplace")
        })
    })

    describe('products', async ()=>{
        let result, productCount

        before(async()=>{
            result = await marketplace.createProduct('iPhoneX', web3.utils.toWei('1', 'Ether'), { from: seller })
            productCount =  await marketplace.productCount()
        })

        it('creates products', async()=>{
            
            //Success
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'iPhoneX', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            // Failure: Product must have a name
            await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
            // Failure: Product must have a price
            await marketplace.createProduct('iPhoneX', 0, { from: seller }).should.be.rejected;
        })

        it('lists products', async ()=>{
            const product = await marketplace.products(productCount)

            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name, 'iPhoneX', 'name is correct')
            assert.equal(product.price, '1000000000000000000', 'price is correct')
            assert.equal(product.owner, seller, 'owner is correct')
            assert.equal(product.purchased, false, 'purchased is correct')

        })

        it('sells products', async ()=>{
            // Track the seller's balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = await web3.utils.toBN(oldSellerBalance)

            // Success: Buyer makes purchase 
            result = await marketplace.purchaseProduct(productCount, { from: buyer, value:  web3.utils.toWei('1', 'Ether')});
            
            // Check logs
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'iPhoneX', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'purchased is correct')

            // Check that seller received funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.toBN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.toBN(price)

            const expectedBalance = oldSellerBalance.add(price)
            assert.equal(newSellerBalance.toString(), expectedBalance.toString())


            // Failure: Product doesn't exist 
            await marketplace.purchaseProduct(99, { from: buyer, value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            // Failure: Buyer doesn't have enough ether 
            await marketplace.purchaseProduct(productCount, { from: buyer, value:  web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            // Failure: Deployer tries to buy the product
            await marketplace.purchaseProduct(productCount, { from: deployer , value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            // Failure: Buyer tries to buy again
            await marketplace.purchaseProduct(productCount, { from: buyer , value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        })

    })
})