import {
    deleteControllerNetwork,
    getControllerNetwork,
    getControllerNetworkMember,
    getControllerNetworkMembers,
    getPeer,
    updateControllerNetwork,
    updateControllerNetworkMember,
} from '@/services/zt-controller';
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormDigit,
    ProFormGroup,
    ProFormInstance,
    ProFormList,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Form, Input, Modal, Space, Switch, Tag, Tooltip, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

const Index: React.FC = () => {
    const params = useParams();

    const formRef = useRef<ProFormInstance>();
    const tableActionRef = useRef<ActionType>();
    const memberFormRef = useRef<ProFormInstance>();

    const [networkId, setNetworkId] = useState('');
    const [network, setNetwork] = useState<ZT.Network>();
    const [members, setMembers] = useState<ZT.NetworkMember[]>([]);
    const [memberPeers, setMemberPeers] = useState<{ [mid: string]: ZT.Peer }>();

    const [memberAuthorizing, setMemberAuthorizing] = useState<{ [mid: string]: boolean }>({});

    const [memberEditing, setMemberEditing] = useState(false);
    const [memberEditId, setMemberEditId] = useState('');

    // const loadMembers = async (id: string) => {
    //     // const peers = await getPeerByNetwork(networkId);
    //     const result = await getControllerNetworkMembers(networkId);
    //     // const members = (result.data ?? []).map((m) => {
    //     //     return { ...m, peer: (peers.paths ?? []).find((p) => p.address === m.nwid) };
    //     // });
    //     console.log(members);
    //     setMembers(result.data ?? []);
    // };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this network?',
            onOk: async () => {
                const result = await deleteControllerNetwork(networkId);
                if (result) {
                    history.back();
                } else {
                    message.error('Delete failed.');
                }
            },
        });
    };

    const handleMemberEdit = (record: ZT.NetworkMember) => {
        setMemberEditId(record.id);
        setMemberEditing(true);
    };

    const handleMemberUpdate = async (values: any) => {
        const result = await updateControllerNetworkMember(networkId, memberEditId, values);
        if (result) {
            message.success('Updated.');
            tableActionRef.current?.reload();
            return true;
        } else {
            message.error('Delete failed.');
            return true;
        }
    };

    const handleMemberAuthorized = async (mid: string, value: boolean) => {
        const loading = message.loading({ content: 'Loading...' });
        setMemberAuthorizing({ [mid]: true });

        await updateControllerNetworkMember(networkId, mid, { authorized: value });

        setMemberAuthorizing({ [mid]: false });
        tableActionRef.current?.reload();

        loading();
    };

    const loadPeer = async (mid: string) => {
        const peer = await getPeer(mid);
        if (Object.keys(peer).length === 0) return;
        setMemberPeers((prev) => ({ ...prev, [mid]: peer }));
    };

    const getPeerLastActive = (peer?: ZT.Peer) => {
        if (!peer) return 'Offline';
        if (peer.paths.length === 0) return 'Offline';

        const path = peer.paths.filter((x) => x.active).sort((a, b) => a.lastReceive - b.lastReceive);
        if (path.length === 0) return '';

        const time = path[0].lastReceive;

        return <Tooltip title={dayjs(time).toISOString()}>{dayjs(time).fromNow()}</Tooltip>;
    };

    const getPhysicalIps = (peer?: ZT.Peer) => {
        if (!peer) return '-';
        if (peer.paths.length === 0) return '-';

        return (
            peer.paths
                .filter((x) => x.active)
                // .sort((a, b) => a.lastReceive - b.lastReceive)
                .map((x, index) => {
                    return <div key={index}>{x.address}</div>;
                })
        );
    };

    const getLatency = (peer?: ZT.Peer) => {
        if (!peer) return '-';
        return peer.latency + 'ms';
    };

    const handleUpdate = async (values: any) => {
        const result = await updateControllerNetwork(networkId, Object.assign(network!, values));
        if (result) {
            message.success('Saved.');
        } else {
            message.error('Update failed.');
        }
    };

    const load = async (id: string) => {
        const result = await getControllerNetwork(id);
        if (!result) {
            history.back();
            return;
        }
        setNetwork(result);
        formRef.current?.setFieldsValue(result);
    };

    useEffect(() => {
        members.forEach((m) => {
            loadPeer(m.address);
        });
    }, [members]);

    useEffect(() => {
        const id = params['id'];
        if (!id) {
            return;
        }
        setNetworkId(id);
        load(id);
    }, [0]);

    return (
        <PageContainer
            title={network?.name ?? 'Network'}
            subTitle={network?.nwid ?? ''}
            extra={[
                <Button danger key="delete" onClick={handleDelete}>
                    Delete
                </Button>,
            ]}
        >
            <ProCard
                tabs={{
                    items: [
                        {
                            key: '1',
                            label: 'Generate',
                            children: (
                                <ProForm formRef={formRef} onFinish={handleUpdate} initialValues={{ dns: { servers: [] } }}>
                                    <ProFormText
                                        label="Name"
                                        name="name"
                                        width="md"
                                        rules={[{ required: true }, { max: 64 }]}
                                        fieldProps={{ autoComplete: 'new-name' }}
                                        allowClear={false}
                                    ></ProFormText>
                                    <ProFormSwitch
                                        label="Private Access"
                                        name="private"
                                        tooltip="Any node that knows the Network ID can become a member. Members cannot be de-authorized or deleted. Members that haven't been online in 30 days will be removed, but can rejoin."
                                    ></ProFormSwitch>
                                    {/* <ProForm.Item label="Routes"></ProForm.Item> */}
                                    <ProFormList
                                        label="Routes"
                                        name={'routes'}
                                        copyIconProps={false}
                                        min={1}
                                        max={99}
                                        creatorButtonProps={{ creatorButtonText: 'Add Route', style: { width: 'auto' } }}
                                        containerStyle={{ width: 'auto', minWidth: 'unset' }}
                                    >
                                        <ProFormGroup key="routes">
                                            <ProFormText
                                                name="target"
                                                label="Destination"
                                                placeholder="192.168.10.0/24"
                                                allowClear={false}
                                                rules={[
                                                    { required: true },
                                                    {
                                                        pattern: /^([\d{1,3}\\.]+)\/(\d{1,2})$/,
                                                        message: 'Please enter ip with CIDR address',
                                                    },
                                                ]}
                                            />
                                            <ProFormText
                                                name="via"
                                                label="Via"
                                                placeholder="(Optional)192.168.10.1"
                                                rules={[
                                                    {
                                                        pattern: /^([\d{1,3}\\.]+)$/,
                                                        message: 'Please enter ip address',
                                                    },
                                                ]}
                                            />
                                        </ProFormGroup>
                                    </ProFormList>
                                    <ProFormSwitch
                                        label="IPv4 Auto Assign"
                                        name={['v4AssignMode', 'zt']}
                                        tooltip="IPv4 range from which to auto-assign IPs. Note that IPs will only be assigned if they also fall within a defined route."
                                    ></ProFormSwitch>
                                    <ProFormDependency name={['v4AssignMode']}>
                                        {({ v4AssignMode }) => {
                                            return (
                                                v4AssignMode?.zt === true && (
                                                    <ProFormList
                                                        label="Auto-Assign Pools"
                                                        name={'ipAssignmentPools'}
                                                        copyIconProps={false}
                                                        min={1}
                                                        max={99}
                                                        creatorButtonProps={{
                                                            creatorButtonText: 'Add Range',
                                                            style: { width: 'auto' },
                                                        }}
                                                        containerStyle={{ width: 'auto', minWidth: 'unset' }}
                                                    >
                                                        <ProFormGroup key="ipAssignmentPools">
                                                            <ProFormText
                                                                name="ipRangeStart"
                                                                label="Range Start"
                                                                placeholder="192.168.10.1"
                                                                allowClear={false}
                                                                rules={[
                                                                    { required: true },
                                                                    {
                                                                        pattern: /^([\d{1,3}\\.]+)$/,
                                                                        message: 'Please enter ip address',
                                                                    },
                                                                ]}
                                                            />
                                                            <ProFormText
                                                                name="ipRangeEnd"
                                                                label="Range End"
                                                                placeholder="192.168.10.199"
                                                                allowClear={false}
                                                                rules={[
                                                                    { required: true },
                                                                    {
                                                                        pattern: /^([\d{1,3}\\.]+)$/,
                                                                        message: 'Please enter ip address',
                                                                    },
                                                                ]}
                                                            />
                                                        </ProFormGroup>
                                                    </ProFormList>
                                                )
                                            );
                                        }}
                                    </ProFormDependency>
                                    <ProForm.Item label="IPv6 Assign Mode">
                                        <ProFormSwitch
                                            label="IPv6 RFC4193 (/128 for each device)"
                                            name={['v6AssignMode', 'rfc4193']}
                                        ></ProFormSwitch>
                                        <ProFormSwitch
                                            label="IPv6 6PLANE (/80 routable for each device)"
                                            name={['v6AssignMode', '6plane']}
                                        ></ProFormSwitch>
                                        {/* <ProFormSwitch
                                                label="Auto-Assign from Range"
                                                name={['v6AssignMode', 'zt']}
                                            ></ProFormSwitch> */}
                                    </ProForm.Item>
                                    <ProFormSwitch label="Enable Broadcast" name="enableBroadcast"></ProFormSwitch>
                                    <ProFormDigit
                                        label="Multicast Recipient Limit"
                                        name="multicastLimit"
                                        width="md"
                                        tooltip="The maximum number of recipients that can receive an Ethernet multicast or broadcast. If the number of recipients exceeds this limit, a random subset will receive the announcement. Setting this higher makes multicasts more reliable on large networks at the expense of bandwidth.

Setting to 0 disables multicast, but be aware that only IPv6 with NDP emulation (RFC4193 or 6PLANE addressing modes) or other unicast-only protocols will work without multicast."
                                        min={0}
                                        fieldProps={{ precision: 0 }}
                                    ></ProFormDigit>
                                    <ProFormDigit
                                        label="MTU"
                                        name="mtu"
                                        width="md"
                                        min={1280}
                                        fieldProps={{ precision: 0 }}
                                    ></ProFormDigit>
                                    <ProFormText label="DNS Search Domain" name={['dns', 'domain']} width="md"></ProFormText>
                                    <ProFormSelect
                                        mode="tags"
                                        label="DNS Servers"
                                        name={['dns', 'servers']}
                                        width="md"
                                        showSearch={false}
                                    ></ProFormSelect>
                                </ProForm>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Members',
                            children: (
                                <ProTable
                                    actionRef={tableActionRef}
                                    search={false}
                                    cardProps={{ bodyStyle: { padding: 0 } }}
                                    pagination={false}
                                    rowKey="id"
                                    columns={[
                                        {
                                            title: 'Auth',
                                            dataIndex: 'authorized',
                                            render: (_, record) => (
                                                <Switch
                                                    checked={record.authorized ?? false}
                                                    loading={memberAuthorizing[record.id] ?? false}
                                                    onChange={(e) => handleMemberAuthorized(record.id, e)}
                                                ></Switch>
                                            ),
                                            width: 80,
                                            align: 'center',
                                        },
                                        {
                                            title: 'Name',
                                            dataIndex: 'name',
                                            width: 150,
                                            copyable: true,
                                        },
                                        {
                                            title: 'Address',
                                            dataIndex: 'address',
                                            width: 150,
                                            copyable: true,
                                        },
                                        {
                                            title: 'Managed IPs',
                                            dataIndex: 'ipAssignments',
                                            render: (_, record) =>
                                                (record.ipAssignments ?? []).map((x, index) => (
                                                    <Typography.Text key={index} copyable>
                                                        {x}
                                                    </Typography.Text>
                                                )),

                                            width: 150,
                                        },
                                        {
                                            title: 'Last Seen',
                                            dataIndex: 'lastSeen',
                                            render: (_, record) => getPeerLastActive(memberPeers?.[record.address]),
                                            align: 'center',
                                            width: 120,
                                        },
                                        {
                                            title: 'Physical IP',
                                            dataIndex: 'ips',
                                            render: (_, record) => getPhysicalIps(memberPeers?.[record.address]),
                                            width: 150,
                                        },
                                        {
                                            title: 'Latency',
                                            dataIndex: 'latency',
                                            render: (_, record) => getLatency(memberPeers?.[record.address]),
                                            align: 'center',
                                            width: 100,
                                        },
                                        {
                                            title: 'Options',
                                            dataIndex: 'options',
                                            renderText: (_, record) => (
                                                <Space>{record.activeBridge && <Tag color="blue">Bridge</Tag>}</Space>
                                            ),
                                            width: 100,
                                        },
                                        {
                                            title: 'Version',
                                            dataIndex: 'version',
                                            renderText: (_, record) => `${record.vMajor}.${record.vMinor}.${record.vProto}`,
                                            align: 'center',
                                            width: 100,
                                        },
                                        {
                                            title: 'Action',
                                            width: 80,
                                            valueType: 'option',
                                            key: 'option',
                                            align: 'center',
                                            render: (_, record) => (
                                                <a key="editable" onClick={() => handleMemberEdit(record)}>
                                                    Edit
                                                </a>
                                            ),
                                        },
                                    ]}
                                    // dataSource={members}
                                    request={async () => {
                                        const result = await getControllerNetworkMembers(networkId);
                                        setMembers(result?.data ?? []);
                                        return {
                                            data: result?.data ?? [],
                                        };
                                    }}
                                ></ProTable>
                            ),
                        },
                        // { key: '3', label: 'Flow Rules', children: <></> },
                    ],
                }}
            ></ProCard>

            <ModalForm
                title="Member Edit"
                width={420}
                open={memberEditing}
                onOpenChange={setMemberEditing}
                request={async () => {
                    const result = await getControllerNetworkMember(networkId, memberEditId);
                    return {
                        ...result,
                    };
                }}
                modalProps={{ destroyOnClose: true, maskClosable: false }}
                onFinish={handleMemberUpdate}
            >
                <ProFormText
                    label="Name"
                    name="name"
                    rules={[{ required: true }, { max: 32 }]}
                    allowClear={false}
                    fieldProps={{ autoComplete: 'new-name' }}
                ></ProFormText>
                <ProFormSwitch label="Authorized" name="authorized"></ProFormSwitch>
                <ProFormSwitch label="Allow Ethernet Bridging" name="activeBridge"></ProFormSwitch>
                <ProFormSwitch label="Do Not Auto-Assign IPs" name="noAutoAssignIps"></ProFormSwitch>

                <ProFormList
                    label="IP Assignments"
                    name="ipAssignments"
                    copyIconProps={false}
                    min={0}
                    max={99}
                    creatorButtonProps={{ creatorButtonText: 'Add IP', style: { width: 'auto' } }}
                    containerStyle={{ width: 'auto', minWidth: 'unset' }}
                    creatorRecord={() => ({
                        toString: () => '',
                    })}
                >
                    {(field, index) => (
                        <Form.Item
                            {...field}
                            key={index.toString()}
                            rules={[
                                { required: true },
                                {
                                    pattern: /^([\d{1,3}\\.]+)$/,
                                    message: 'Please enter ip with CIDR address',
                                },
                            ]}
                        >
                            <Input placeholder="192.168.10.11" />
                        </Form.Item>
                    )}
                </ProFormList>
            </ModalForm>
        </PageContainer>
    );
};

export default Index;
