import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { formatDate } from '../../service/Util';
import styles from './itemstyle.module.css'
import { DeleteItem, GetItems, UpdateItem } from '../../service/ItemData';
import { useItemType } from "../NavBar/ItemTypeContext";
import EditItem from './EditItem';

export function ItemConsole() {

    interface Item {
        itemId: string;
        requestId: string;
        claimedUserId: string;
        itemName: string;
        description: string;
        location: string;
        date: string;
        status: string;
    }

    const [itemData, setItemData] = useState<Item[]>([]);
    const [selectedRow, setSelectedRow] = useState<Item | null>(null);
    const [showEditItem, setShowEditItem] = useState(false);
    const { selectedItemType } = useItemType();

    // Loading Data
    useEffect(() => {
    const loadData = async () => {
        const itmDetails = await GetItems()
        // sort the data based on date in Ascending order
        itmDetails.sort((a: Item, b: Item) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // console.log("Item Console Item Type :", selectedItemType);

        // Data Selection
        if (selectedItemType === "ALL") {
        setItemData(itmDetails)
        } else {
        setItemData(itmDetails.filter((item: Item) => item.status === selectedItemType));
        }
    }
    loadData();
    }, [selectedItemType]);

    const getTHeads = () =>{
        if (selectedItemType === "ALL") {
            return [
                "Item ID",
                "Request ID",
                "Claimed User ID",
                "Item Name",
                "Description",
                "Location",
                "Date",
                "Status",
                "Action"
            ];
        } else {
            return [
                "Item ID",
                "Item Name",
                "Description",
                "Location",
                "Date",
                "Status",
                "Action"
            ];
        }
    }

    const tHeads = getTHeads();

    // Handle edit function
    const handleEdit = (data: Item) => {
        console.log("Edit clicked for row:", data);
        setSelectedRow(data);
        setShowEditItem(true);
    };

    const handleClose = () => {
        setShowEditItem(false);
        setSelectedRow(null);
    }

    const handleUpdate = (updatedItem: Item) => {
        const updatedItems = itemData.map((item) => 
            item.itemId === updatedItem.itemId ? updatedItem : item
        );
        setItemData(updatedItems);
    }

    //handle delete function
    const handleDelete = async (itemId: string) => {
        try {
            await DeleteItem(itemId);
            setItemData(itemData.filter((item) => item.itemId !== itemId));
        } catch (error) {
            console.error("Failed to delete item", error)   
        }
    }

    //page title
    const formatedTitle = selectedItemType === "ALL" ? "Items List" : selectedItemType + " Items List";

    return (
        <>
            <h1 className={styles.itemTitle}>{formatedTitle}</h1>
            <Table responsive="lg" striped bordered hover>
                <thead className="text-center align-middle">
                    <tr>
                        {tHeads.map((headings) => (
                            <th>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {itemData.map((data) => (
                        <tr key={data.itemId} className="text-center align-middle">
                            <td>{data.itemId}</td>
                            <td>{data.requestId}</td>
                            <td>{data.claimedUserId}</td>
                            <td>{data.itemName}</td>
                            <td>{data.description}</td>
                            <td>{data.location}</td>
                            <td>{formatDate(data.date)}</td>
                            <td>{data.status}</td>

                            <td className={styles.actions}>
                                <div className={styles.actionButtons}>
                                    <Button variant="outline-success" onClick={() => handleEdit(data)}>Edit</Button>
                                    <Button variant="outline-danger" onClick={() => handleDelete(data.requestId)}>Delete</Button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>
                
            <EditItem
                show={showEditItem}
                selectedRow={selectedRow}
                handleClose={handleClose}
                handleUpdate={handleUpdate}
                updateItems={UpdateItem}
            />
        </>
    );
}