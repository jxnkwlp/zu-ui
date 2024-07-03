import { createControllerNetwork, getControllerNetworks, getStatus, updateControllerNetwork } from '@/services/zt-controller';
import { DrawerForm, PageContainer, ProDescriptions, ProFormSwitch, ProFormText, ProList } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Avatar, Button, Card, Space, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';

const Index: React.FC = () => {
    const [nodeStatus, setNodeStatus] = useState<ZT.Status>();
    const [networks, setNetworks] = useState<ZT.Network[]>([]);

    const [createModalVisible, setCreateModalVisible] = useState(false);

    const loadNetworks = async () => {
        const networksResult = await getControllerNetworks();
        setNetworks((networksResult?.data ?? []).sort((a, b) => a.creationTime - b.creationTime));
    };

    const load = async () => {
        const status = await getStatus();
        setNodeStatus(status);
    };

    // const handleRandomRouteCIDR = () => {};

    const handleCreateNetwork = async (values: any) => {
        let result: ZT.Network;
        if (values.id) {
            result = await updateControllerNetwork(values.id, values);
        } else {
            result = await createControllerNetwork(values);
        }

        if (!result) {
            message.error('Create network failed.');
            return false;
        }

        loadNetworks();

        return true;
    };

    useEffect(() => {
        load();
        loadNetworks();
    }, [0]);

    return (
        <PageContainer>
            <Card title={'Node: ' + nodeStatus?.address}>
                <ProDescriptions dataSource={nodeStatus}>
                    <ProDescriptions.Item label="Address" dataIndex="address" copyable></ProDescriptions.Item>
                    <ProDescriptions.Item label="Version" dataIndex="version"></ProDescriptions.Item>
                </ProDescriptions>
            </Card>

            <ProList
                style={{ marginTop: 15 }}
                dataSource={networks}
                rowKey="id"
                headerTitle={`Networks (${networks.length}/128)`}
                showActions="hover"
                metas={{
                    avatar: {
                        render: (_, record) => (
                            <Avatar size="large">{record.name && record.name[0].toLocaleUpperCase()}</Avatar>
                        ),
                    },
                    title: {
                        // dataIndex: 'name',
                        render: (_, record) => <Link to={`/network/${record.nwid}`}>{record.name}</Link>,
                    },
                    description: {
                        render: (_, record) => <Typography.Text copyable>{record.nwid}</Typography.Text>,
                    },
                    subTitle: {
                        render: (_, record) => {
                            return <Space size={0}>{record.private && <Tag color="#5BD8A6">Private</Tag>}</Space>;
                        },
                    },
                    content: {
                        render: (_, record) => {
                            return (
                                <Space direction="vertical">
                                    <Tag color="green">
                                        Memers: {record.meta.authorizedMemberCount}/{record.meta.totalMemberCount}
                                    </Tag>
                                    {record.routes.length > 0 && <span>{record.routes[0].target}</span>}
                                </Space>
                            );
                        },
                    },
                    actions: {
                        render: (text, record) => <Link to={`/network/${record.nwid}`}>Edit</Link>,
                    },
                }}
                toolBarRender={() => [
                    <Button type="primary" key="create" onClick={() => setCreateModalVisible(true)}>
                        Create
                    </Button>,
                ]}
            ></ProList>

            <DrawerForm
                open={createModalVisible}
                drawerProps={{ destroyOnClose: true }}
                width={420}
                onOpenChange={setCreateModalVisible}
                title="Create Network"
                initialValues={{
                    private: true,
                    route: '192.168.10.0/24',
                }}
                onFinish={(values) => {
                    return handleCreateNetwork({
                        ...values,
                        routes: [{ target: values.route }],
                        v4AssignMode: { zt: true },
                        v6AssignMode: { zt: true },
                        enableBroadcast: true,
                    });
                }}
            >
                <ProFormText label="Exists ID" name="id" rules={[{ max: 16 }]}></ProFormText>
                <ProFormText label="Name" name="name" rules={[{ required: true }, { max: 64 }]}></ProFormText>
                <ProFormSwitch label="Private Network" name="private"></ProFormSwitch>
                <ProFormText
                    label="Routes "
                    name="route"
                    rules={[
                        { required: true },
                        {
                            pattern: /^([\d{1,3}\\.]+)\/(\d{1,2})$/,
                            message: 'Please enter ip with CIDR address',
                        },
                    ]}
                ></ProFormText>
                {/* <ProForm.Item
                    label="Routes"
                    name="route"
                    rules={[
                        { required: true },
                        {
                            pattern:
                                /^((^|(?<!^)\\.)(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){4}(\/(3[0-2]|2[0-9]|1[0-9]|[1-9]))$/,
                            message: 'Please enter ip with CIDR address',
                        },
                    ]}
                >
                    <Space>
                        <Input placeholder="192.168.10.0/24" allowClear />
                        <Button onClick={handleRandomRouteCIDR}>Refresh</Button>
                    </Space>
                </ProForm.Item> */}
            </DrawerForm>
        </PageContainer>
    );
};

export default Index;
