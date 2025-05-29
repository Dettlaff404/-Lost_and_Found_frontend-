import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { formatDate } from '../../service/Util';
import styles from './itemstyle.module.css'
import { DeleteItem, GetItems, UpdateItem } from '../../service/ItemData';
import { useItemType } from "../NavBar/ItemTypeContext";
import EditItem from './EditItem';
import { useAuth } from '../Auth/AuthProvider';

export function ItemConsole() {
    // Get user role from auth context
    const { userRole } = useAuth();

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

            // Data Selection
            if (selectedItemType === "ALL") {
                setItemData(itmDetails)
            } else {
                setItemData(itmDetails.filter((item: Item) => item.status === selectedItemType));
            }
        }
        loadData();
    }, [selectedItemType]);

    // Dynamic table headers based on user role and item type
    const getTableHeaders = (): string[] => {
        if (userRole === 'ROLE_USER') {
            if (selectedItemType === 'CLAIMED') {
                return [
                    "Item Name",
                    "Claimed User ID",
                    "Description",
                    "Location",
                    "Date",
                    "Status"
                ];
            } else {
                return [
                    "Item Name",
                    "Description",
                    "Location",
                    "Date",
                    "Status"
                ];
            }
        } else {
            // For non-user roles (ADMIN, STAFF, etc.)
            if (selectedItemType === 'CLAIMED' || selectedItemType === 'ALL') {
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
                    "Request ID",
                    "Item Name",
                    "Description",
                    "Location",
                    "Date",
                    "Status",
                    "Action"
                ];
            }
        }
    };

    const tHeads = getTableHeaders();

    // Render table cells based on user role and item type
    const renderTableCells = (data: Item) => {
        if (userRole === 'ROLE_USER') {
            if (selectedItemType === 'CLAIMED') {
                return (
                    <>
                        <td>{data.itemName}</td>
                        <td>{data.claimedUserId}</td>
                        <td>{data.description}</td>
                        <td>{data.location}</td>
                        <td>{formatDate(data.date)}</td>
                        <td>{data.status}</td>
                    </>
                );
            } else {
                return (
                    <>
                        <td>{data.itemName}</td>
                        <td>{data.description}</td>
                        <td>{data.location}</td>
                        <td>{formatDate(data.date)}</td>
                        <td>{data.status}</td>
                    </>
                );
            }
        } else {
            // For non-user roles (ADMIN, STAFF, etc.)
            if (selectedItemType === 'CLAIMED' || selectedItemType === 'ALL') {
                return (
                    <>
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
                                <Button variant="outline-danger" onClick={() => handleDelete(data.itemId)}>Delete</Button>
                            </div>
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td>{data.itemId}</td>
                        <td>{data.requestId}</td>
                        <td>{data.itemName}</td>
                        <td>{data.description}</td>
                        <td>{data.location}</td>
                        <td>{formatDate(data.date)}</td>
                        <td>{data.status}</td>
                        <td className={styles.actions}>
                            <div className={styles.actionButtons}>
                                <Button variant="outline-success" onClick={() => handleEdit(data)}>Edit</Button>
                                <Button variant="outline-danger" onClick={() => handleDelete(data.itemId)}>Delete</Button>
                            </div>
                        </td>
                    </>
                );
            }
        }
    };

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

    // Handle delete function - Fixed to use itemId instead of requestId
    const handleDelete = async (itemId: string) => {
        try {
            await DeleteItem(itemId);
            setItemData(itemData.filter((item) => item.itemId !== itemId));
        } catch (error) {
            console.error("Failed to delete item", error)   
        }
    }

    // Page title
    const formatedTitle = selectedItemType === "ALL" ? "Items List" : selectedItemType + " Items List";

    return (
        <>
            <h1 className={styles.itemTitle}>{formatedTitle}</h1>
            <Table responsive="lg" striped bordered hover>
                <thead className="text-center align-middle">
                    <tr>
                        {tHeads.map((heading, index) => (
                            <th key={index}>{heading}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {itemData.map((data) => (
                        <tr key={data.itemId} className="text-center align-middle">
                            {renderTableCells(data)}
                        </tr>
                    ))}
                </tbody>
            </Table>
                
            {/* Only show EditItem modal for non-user roles */}
            {userRole !== 'ROLE_USER' && (
                <EditItem
                    show={showEditItem}
                    selectedRow={selectedRow}
                    handleClose={handleClose}
                    handleUpdate={handleUpdate}
                    updateItems={UpdateItem}
                />
            )}
        </>
    );
}