import { Table, ScrollArea } from '@mantine/core';
import PropTypes from 'prop-types';

export default function DataTable({ columns, data, onRowClick }) {
    const headers = columns.map((col) => (
        <Table.Th key={col.key}>{col.label}</Table.Th>
    ));

    const rows = data.map((row, index) => (
        <Table.Tr
            key={row.id || index}
            onClick={() => onRowClick && onRowClick(row)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
        >
            {columns.map((col) => (
                <Table.Td key={`${row.id || index}-${col.key}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                </Table.Td>
            ))}
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>{headers}</Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}

DataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func, // Optional custom renderer
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
};
