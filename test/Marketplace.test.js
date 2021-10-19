const { assert } = require("chai")

const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace', (accounts)=>{
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


})