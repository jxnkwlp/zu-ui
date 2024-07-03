declare namespace ZT {
    interface Status {
        address: string;
        clock: number;
        config: StatusConfig;
        online: boolean;
        planetWorldId: number;
        planetWorldTimestamp: number;
        publicIdentity: string;
        tcpFallbackActive: boolean;
        version: string;
        versionBuild: number;
        versionMajor: number;
        versionMinor: number;
        versionRev: number;
    }

    interface StatusConfig {
        settings: StatusSettings;
    }

    interface StatusSettings {
        allowManagementFrom: string[];
        allowTcpFallbackRelay: boolean;
        forceTcpRelay: boolean;
        listeningOn: string[];
        portMappingEnabled: boolean;
        primaryPort: number;
        secondaryPort: number;
        softwareUpdate: string;
        softwareUpdateChannel: string;
        surfaceAddresses: string[];
        tertiaryPort: number;
    }

    interface Peer {
        address: string;
        isBonded: boolean;
        latency: number;
        paths: PeerPath[];
        role: string;
        version: string;
        versionMajor: number;
        versionMinor: number;
        versionRev: number;
        tunneled: boolean;
    }

    interface PeerPath {
        active: boolean;
        address: string;
        expired: boolean;
        lastReceive: number;
        lastSend: number;
        localSocket: number;
        preferred: boolean;
        trustedPathId: number;
    }

    interface ControllerStatus {
        controller: boolean;
        apiVersion: number;
        clock: number;
        databaseReady: boolean;
    }

    interface Network {
        id: string;
        nwid: string;
        name: string;
        enableBroadcast: boolean;
        mtu: number;
        dns: NetworkDns;
        private: boolean;
        ipAssignmentPools: NetworkIpAssignmentPool[];
        v4AssignMode: NetworkV4AssignMode;
        v6AssignMode: NetworkV6AssignMode;
        multicastLimit: number;
        routes: NetworkRoute[];
        creationTime: number;
        objtype: string;
        revision: number;
        capabilities: number[];
        rules: Rule[];
        tags: number[];
        meta: NetworkMeta;
    }

    interface NetworkMeta {
        authorizedMemberCount: number;
        totalMemberCount: number;
    }

    interface NetworkDns {
        domain: string;
        servers: string[];
    }

    interface NetworkIpAssignmentPool {
        ipRangeStart: string;
        ipRangeEnd: string;
    }

    interface NetworkRoute {
        target: string;
        via: string;
    }

    interface Rule {
        not: boolean;
        or: boolean;
        type: string;
        property1: null;
        property2: null;
    }

    interface NetworkV4AssignMode {
        zt: boolean;
    }

    interface NetworkV6AssignMode {
        '6plane': boolean;
        rfc4193: boolean;
        zt: boolean;
    }

    interface NetworkMember {
        id: string;
        authorized: boolean;
        activeBridge: boolean;
        ipAssignments: string[];
        name: string;
        noAutoAssignIps: boolean;
        ssoExempt: boolean;
        address: string;
        authenticationExpiryTime: number;
        capabilities: number[];
        creationTime: number;
        identity: string;
        lastAuthorizedCredential: string;
        lastAuthorizedCredentialType: string;
        lastAuthorizedTime: number;
        lastDeauthorizedTime: number;
        nwid: string;
        objtype: string;
        remoteTraceLevel: number;
        remoteTraceTarget: string;
        revision: number;
        tags: null;
        vMajor: number;
        vMinor: number;
        vProto: number;
        vRev: number;
    }

    interface NetworkMemberUpdate {
        name?: string;
        authorized?: boolean;
        activeBridge?: boolean;
        ipAssignments?: string[];
        noAutoAssignIps?: boolean;
        ssoExempt?: boolean;
    }

    interface Networks {
        data: Network[];
        meta: NetworksMeta;
    }

    interface NetworksMeta {
        networkCount: number;
    }

    interface NetworkMembers {
        data: NetworkMember[];
        meta: NetworkMembersMeta;
    }

    interface NetworkMembersMeta {
        totalCount: number;
        authorizedCount: number;
    }
}
