import { request } from '@umijs/max';

export function getStatus() {
    return request<ZT.Status>('/api/status', {});
}

// http://localhost:9993/peer
export function getPeers() {
    return request<ZT.Peer[]>('/api/peer', {});
}

// http://localhost:9993/peer/{network_id}
export function getPeer(mid: string) {
    return request<ZT.Peer>(`/api/peer/${mid}`, {});
}

// http://localhost:9993/controller
export function getController() {
    return request<ZT.ControllerStatus>('/api/controller', {});
}

// http://localhost:9993/unstable/controller/network
export function getControllerNetworks() {
    return request<ZT.Networks>('/api/unstable/controller/network', {});
}

// http://localhost:9993/unstable/controller/network/{network_id}/member
export function getControllerNetworkMembers(nwId: string) {
    return request<ZT.NetworkMembers>(`/api/unstable/controller/network/${nwId}/member`, {});
}

// http://localhost:9993/controller/network
export function getControllerNetworkIds() {
    return request<string[]>('/api/controller/network', {});
}

// http://localhost:9993/controller/network/{network_id}
export function getControllerNetwork(nwId: string) {
    return request<ZT.Network>(`/api/controller/network/${nwId}`, {});
}

// http://localhost:9993/controller/network
export function createControllerNetwork(payload: ZT.Network) {
    return request<ZT.Network>('/api/controller/network', {
        method: 'POST',
        data: payload,
    });
}

// http://localhost:9993/controller/network/{network_id}
export function updateControllerNetwork(nwId: string, payload: ZT.Network) {
    return request<ZT.Network>(`/api/controller/network/${nwId}`, {
        method: 'PUT',
        data: payload,
    });
}

// http://localhost:9993/controller/network/{network_id}
export function deleteControllerNetwork(nwId: string) {
    return request(`/api/controller/network/${nwId}`, {
        method: 'DELETE',
    });
}

// http://localhost:9993/controller/network/{network_id}/member
export function getControllerNetworkMemberIds(nwId: string) {
    return request<Record<string, number>>(`/api/controller/network/${nwId}/member`, {});
}

// http://localhost:9993/controller/network/{network_id}/member/{node_id}
export function getControllerNetworkMember(nwId: string, mId: string) {
    return request<ZT.NetworkMember>(`/api/controller/network/${nwId}/member/${mId}`, {});
}

// http://localhost:9993/controller/network/{network_id}/member/{node_id}
export function deleteControllerNetworkMember(nwId: string, mId: string) {
    return request(`/api/controller/network/${nwId}/member/${mId}`, {
        method: 'DELETE',
    });
}

// http://localhost:9993/controller/network/{network_id}/member/{node_id}
export function updateControllerNetworkMember(nwId: string, mId: string, payload: ZT.NetworkMemberUpdate) {
    return request(`/api/controller/network/${nwId}/member/${mId}`, {
        method: 'POST',
        data: payload,
    });
}
