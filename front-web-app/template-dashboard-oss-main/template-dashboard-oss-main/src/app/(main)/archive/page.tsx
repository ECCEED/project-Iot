'use client'

import React, { useState } from 'react';
import { CSmartTable, CAvatar, CBadge, CButton, CCollapse, CCardBody } from '@coreui/react-pro';


// Example Date Range Calculation


export default function ArchivePage() {
  
  const [details, setDetails] = useState<number[]>([]);

  // Sample columns definition for the table
  const columns = [
    { key: 'avatar', label: '', filter: false, sorter: false },
    { key: 'name', _style: { width: '20%' } },
    {
      key: 'registered',
      sorter: (date1: { registered: string }, date2: { registered: string }) => {
        const a = new Date(date1.registered);
        const b = new Date(date2.registered);
        return a > b ? 1 : b > a ? -1 : 0;
      },
    },
    { key: 'role', _style: { width: '20%' } },
    'status',
    { key: 'show_details', label: '', _style: { width: '1%' }, filter: false, sorter: false },
  ];

  // Sample items data
  const items = [
    { id: 1, name: 'Samppa Nori', avatar: '1.jpg', registered: '2021/03/01', role: 'Member', status: 'Active' },
    { id: 2, name: 'Estavan Lykos', avatar: '2.jpg', registered: '2018/02/07', role: 'Staff', status: 'Banned' },
    { id: 3, name: 'Chetan Mohamed', avatar: '3.jpg', registered: '2020/01/15', role: 'Admin', status: 'Inactive' },
    { id: 4, name: 'Derick Maximinus', avatar: '4.jpg', registered: '2019/04/05', role: 'Member', status: 'Pending' },
    { id: 5, name: 'Friderik Dávid', avatar: '5.jpg', registered: '2022/03/25', role: 'Staff', status: 'Active' },
    { id: 6, name: 'Yiorgos Avraamu', avatar: '6.jpg', registered: '2017/01/01', role: 'Member', status: 'Active' },
  ];

  // Function to get badge color based on status
  const getBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };

  // Function to toggle details visibility
  const toggleDetails = (id: number) => {
    const position = details.indexOf(id);
    const newDetails = [...details];
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails.push(id);
    }
    setDetails(newDetails);
  };

  return (
    <>
      <section aria-labelledby="table-archive">
        <h1
          id="table-archive"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Archive Table
        </h1>
     
        <div className="mt-10">
          {/* Table */}
          <CSmartTable
            activePage={1}
            cleaner
            clickableRows
            columns={columns}
            columnFilter
            columnSorter
    
            items={items}
            itemsPerPageSelect
            itemsPerPage={5}
            pagination
            scopedColumns={{
              avatar: (item) => (
                <td>
                  <CAvatar src={`./../../images/avatars/${item.avatar}`} />
                </td>
              ),
              registered: (item) => {
                const date = new Date(item.registered);
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                return <td>{date.toLocaleDateString('en-US', options)}</td>;
              },
              status: (item) => (
                <td>
                  <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                </td>
              ),
              show_details: (item) => (
                <td className="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => toggleDetails(item.id)}
                  >
                    {details.includes(item.id) ? 'Hide' : 'Show'}
                  </CButton>
                </td>
              ),
              details: (item) => (
                <CCollapse visible={details.includes(item.id)}>
                  <CCardBody className="p-3">
                    <h4>{item.name}</h4>
                    <p className="text-body-secondary">User since: {item.registered}</p>
                    <CButton size="sm" color="info">
                      User Settings
                    </CButton>
                    <CButton size="sm" color="danger" className="ms-1">
                      Delete
                    </CButton>
                  </CCardBody>
                </CCollapse>
              ),
            }}
            selectable
            sorterValue={{ column: 'status', state: 'asc' }}
            tableFilter
            tableProps={{
              className: 'add-this-class',
              responsive: true,
              striped: true,
              hover: true,
            }}
            tableBodyProps={{
              className: 'align-middle',
            }}
          
          />
        </div>
      </section>
    </>
  );
}
