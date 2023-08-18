import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Tuple, TupleItem, beginCell } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    it("simple test", async () => {
        const t = '0x415a';
        const rand = BigInt(t);
        console.log(rand.toString(16));

        const text = beginCell().storeUint(0, 32).storeUint(rand, 16).endCell();
        const target = await task4.get_caesar_cipher_encrypt(20n, text);
        const inv = await task4.get_caesar_cipher_decrypt(20n, target);
        console.log(target);
        console.log(inv);
        //expect(BigInt(target.beginParse().loadUint(344))).toBe(BigInt(x));
    });

    it("simple test", async () => {
        const rand = (x: number) => BigInt("0b" + Array.from({ length: x * 8 }, () => Math.random() > 0.5 ? 1 : 0).join(''));

        const x = rand(123);
        const y = rand(127);
        const z = rand(127);
        console.log(x.toString(16));
        console.log(y.toString(16));
        console.log(z.toString(16));

        const sub2 = beginCell().storeUint(z, 127 * 8).endCell();
        const sub = beginCell().storeUint(y, 127 * 8).storeRef(sub2).endCell();
        const text = beginCell().storeUint(0, 32).storeUint(x, 123 * 8).storeRef(sub).endCell();
        const target = await task4.get_caesar_cipher_encrypt(20n, text);
        const inv = await task4.get_caesar_cipher_decrypt(20n, target);
        console.log(target);
        console.log(inv);
        //expect(BigInt(target.beginParse().loadUint(344))).toBe(BigInt(x));
    });

});
