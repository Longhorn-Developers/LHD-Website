
"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { Member, Team } from "../_data/workerFunctions";
import { useModal } from "./ModalContext";

interface NewMemberInput {
    name: string;
    email: string;
    team: string;
    role: string;
    isLead: boolean;
    isExec: boolean;
    execRole: string;
    githubID: string;
    discordID: string;
    status: string;
}

interface MemberContactUpdate {
    email: string;
    githubID: string;
    discordID: string;
}

interface TeamContextType {
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    users: Member[];
    setUsers: React.Dispatch<React.SetStateAction<Member[]>>;
    teams: Team[];
    databaseAvailable: boolean;
    createTeam: (name: string, description: string) => Promise<boolean>;
    loading: boolean;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    deleteMember: (memberId: string) => Promise<boolean>;
    removeMember: (memberId: string, teamId: string) => Promise<void>;
    syncTeam: (teamId: string) => void;
    handleAddMember: (
        selectedMember: string,
        selectedTeam: string,
        selectedRole: string,
        isLead: boolean,
        isExec: boolean,
        execRole: string
    ) => Promise<void>;
    handleCreateMember: (member: NewMemberInput) => Promise<void>;
    handleUpdateMember: (
        memberId: string,
        teamId: string,
        role: string,
        isLead: boolean,
        isExec: boolean,
        execRole: string,
        contactInfo?: MemberContactUpdate,
        closeOnSuccess?: boolean
    ) => Promise<boolean>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [users, setUsers] = useState<Member[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [databaseAvailable, setDatabaseAvailable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { closeModal } = useModal();

    const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        if (!user) return;

        const getAllMembers = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/teams`, {
                    withCredentials: true,
                });

                setMembers(res.data.members);
                setUsers(res.data.users);
                setTeams(res.data.teams);
                setDatabaseAvailable(res.data.databaseAvailable);
                setError(res.data.warning ?? "");

            } catch (error) {
                console.error(error);
                setDatabaseAvailable(false);
                setError("Unable to load teams from the server.");
            }
        };

        getAllMembers();
    }, [user, apiUrl]);

    const removeMember = async (memberId: string, teamId: string) => {
        try {
            setLoading(true);
            setError("");
            const teamIdentifier = encodeURIComponent(teamId);
            const res = await axios.delete(
                `${apiUrl}/api/teams/${teamIdentifier}/${encodeURIComponent(memberId)}`,
                { withCredentials: true }
            );

            setMembers((prev) =>
                prev.filter(
                    (member) =>
                        (member.userID ?? member.memberID) !== memberId ||
                        (member.teamID
                            ? member.teamID !== res.data.user.teamID
                            : member.team !== res.data.user.team)
                )
            );

            if (user && (user.userID ?? user.memberID) === memberId) {
                router.refresh();
            }

        } catch (err) {
            console.error(
                "Failed to remove member:",
                axios.isAxiosError(err) ? err.response?.data : err
            );

            setError("Failed to remove member.");
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (memberId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");

            await axios.delete(
                `${apiUrl}/api/members/${encodeURIComponent(memberId)}`,
                { withCredentials: true }
            );

            setMembers((prev) =>
                prev.filter(
                    (member) =>
                        (member.userID ?? member.memberID) !== memberId
                )
            );
            setUsers((prev) =>
                prev.filter(
                    (member) =>
                        (member.userID ?? member.memberID) !== memberId
                )
            );
            return true;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Failed to delete member."
                : "Failed to delete member.";
            console.error("Failed to delete member:", error);
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const syncTeam = async(teamIdentifier: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/teams/${encodeURIComponent(teamIdentifier)}`, {
                withCredentials: true,
            });
            const { team, members: teamMembers } = response.data;
            setMembers((prev) => [
                ...prev.filter(
                    (member) =>
                        member.teamID !== team.id &&
                        member.team?.toLowerCase() !== team.name.toLowerCase()
                ),
                ...teamMembers,
            ]);
        } catch (error) {
            console.error("Failed to sync team:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTeam = async (
        name: string,
        description: string
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.post<{ team: Team }>(
                `${apiUrl}/api/teams`,
                { name, description },
                { withCredentials: true }
            );
            setTeams((previous) =>
                [...previous, response.data.team].sort((left, right) =>
                    left.name.localeCompare(right.name)
                )
            );
            return true;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Failed to create team."
                : "Failed to create team.";
            console.error("Failed to create team:", error);
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (
        selectedMember: string,
        selectedTeam: string,
        selectedRole: string,
        isLead: boolean,
        isExec: boolean,
        execRole: string
    ) => {
        if (!selectedMember) return;

        const member = users.find(
            (member) => (member.userID ?? member.memberID) === selectedMember
        );

        if (!member) return;

        const memberId = member.userID ?? member.memberID;
        if (!memberId) return;

        try {
            const response = await axios.post(
                `${apiUrl}/api/teams/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(memberId)}`,
                { role: selectedRole, isLead, isExec, execRole },
                { withCredentials: true }
            );
            const newMember: Member = response.data.member;
            setMembers((prev) => [
                ...prev.filter(
                    (entry) =>
                        (entry.userID ?? entry.memberID) !== memberId ||
                        (entry.teamID && entry.teamID !== newMember.teamID)
                ),
                newMember,
            ]);
            setUsers((prev) =>
                prev.map((entry) =>
                    (entry.userID ?? entry.memberID) === memberId
                        ? { ...entry, isExec: newMember.isExec, execRole: newMember.execRole }
                        : entry
                )
            );
            closeModal();
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Failed to add member."
                : "Failed to add member.";
            console.error("Failed to add member:", error);
            setError(message);
        }
    };

    const handleCreateMember = async (member: NewMemberInput) => {
        try {
            const res = await axios.post<{ member: Member }>(
                `${apiUrl}/api/teams/${encodeURIComponent(member.team)}/create-member`,
                member,
                { withCredentials: true }
            );

            const newMember = res.data.member;
            setMembers((prev) => [
                ...prev.filter(
                    (entry) =>
                        (entry.userID ?? entry.memberID) !== newMember.userID ||
                        entry.teamID !== newMember.teamID
                ),
                newMember,
            ]);
            setUsers((prev) => [...prev, newMember]);

            closeModal();

        } catch (error) {
            console.error("Error creating member:", error);
        }
    };

    const handleUpdateMember = async (
        memberId: string,
        teamId: string,
        role: string,
        isLead: boolean,
        isExec: boolean,
        execRole: string,
        contactInfo?: MemberContactUpdate,
        closeOnSuccess = true
    ) => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.put<{ member: Member }>(
                `${apiUrl}/api/teams/${encodeURIComponent(teamId)}/${encodeURIComponent(memberId)}`,
                {
                    role,
                    isLead,
                    isExec,
                    execRole,
                    ...(contactInfo ?? {}),
                },
                { withCredentials: true }
            );
            const updatedMember = response.data.member;

            setMembers((prev) =>
                prev.map((member) =>
                    (member.userID ?? member.memberID) === updatedMember.userID
                        ? member.teamID === updatedMember.teamID
                            ? updatedMember
                            : {
                                  ...member,
                                  name: updatedMember.name,
                                  email: updatedMember.email,
                                  githubID: updatedMember.githubID,
                                  discordID: updatedMember.discordID,
                                  isExec: updatedMember.isExec,
                                  execRole: updatedMember.execRole,
                              }
                        : member
                )
            );
            setUsers((prev) =>
                prev.map((member) =>
                    (member.userID ?? member.memberID) === updatedMember.userID
                        ? {
                              ...member,
                              name: updatedMember.name,
                              email: updatedMember.email,
                              githubID: updatedMember.githubID,
                              discordID: updatedMember.discordID,
                              isExec: updatedMember.isExec,
                              execRole: updatedMember.execRole,
                          }
                        : member
                )
            );
            if (closeOnSuccess) {
                closeModal();
            }
            return true;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Failed to update member."
                : "Failed to update member.";
            console.error("Failed to update member:", error);
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <TeamContext.Provider
            value={{
                members,
                setMembers,
                users,
                setUsers,
                teams,
                databaseAvailable,
                createTeam,
                loading,
                error,
                setError,
                deleteMember,
                removeMember,
                syncTeam,
                handleAddMember,
                handleCreateMember,
                handleUpdateMember
            }}
        >
            {children}
        </TeamContext.Provider>
    );
}

export function useTeam() {
    const context = useContext(TeamContext);

    if (!context) {
        throw new Error("useTeam must be used within a TeamProvider");
    }

    return context;
}
