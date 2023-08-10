import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { beginCell, Cell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

function cellHash(cell: Cell) {
    return BigInt(`0x${cell.hash().toString('hex')}`);
}

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    it('hash from empty_tree', async () => {
        const tree = beginCell().endCell();
        const target = await task1.getFindBranchByHash(cellHash(tree), tree);
        expect(cellHash(target)).toEqual(cellHash(tree));
    });

    it('hash from not_empty_tree', async () => {
        const tree = beginCell().storeUint(1n, 32).endCell();
        const target = await task1.getFindBranchByHash(cellHash(tree), tree);
        expect(cellHash(target)).toEqual(cellHash(tree));
    });

    it('hash from node2', async () => {
        const node1 = beginCell().storeUint(1n, 32).endCell();
        const node2 = beginCell().storeUint(2n, 32).endCell();
        const tree = beginCell().storeRef(node1).storeRef(node2).endCell();

        const target = await task1.getFindBranchByHash(cellHash(node2), tree);
        expect(cellHash(target)).toEqual(cellHash(node2));
    });

    it('deep search...', async () => {
        const node211 = beginCell().storeUint(211n, 32).endCell();
        const node21 = beginCell().storeUint(21n, 32).storeRef(node211).endCell();
        const node1 = beginCell().storeUint(1n, 32).endCell();
        const node2 = beginCell().storeRef(node21).endCell();
        const tree = beginCell().storeRef(node1).storeRef(node2).endCell();

        const target = await task1.getFindBranchByHash(cellHash(node211), tree);
        expect(cellHash(target)).toEqual(cellHash(node211));
    });
});
