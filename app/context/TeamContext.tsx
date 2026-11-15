
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
import { Member } from "../_data/workerFunctions";
import { useModal } from "./ModalContext";

export const teams: Record<string, string> = {
    "help-me-bevo": "Help Me Bevo",
    "internal-tooling": "Internal Tooling",
    "lhd-website": "LHD Website",
    "longhorn-lifts": "Longhorn Lifts",
    "longhorn-loop": "Longhorn Loop",
    "longhorn-studies": "Longhorn Studies",
    "mobilize-ut": "Mobilize UT",
    "pet-bevo": "Pet Bevo",
    "ut-dining": "UT Dining",
    "ut-lectures-plus": "UT Lectures Plus",
    "ut-marketplace": "UT Marketplace",
    "ut-registration-plus": "UT Registration Plus",
};

interface TeamContextType {
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    loading: boolean;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    removeMember: (memberId: string, teamId: string) => Promise<void>;
    syncTeam: (teamId: string) => void;
    handleAddMember: (selectedMember: any, selectedTeam: any, selectedRole: any, isLead: any, isExec: any, execRole: any) => Promise<void>;
    handleCreateMember: (
        name: string,
        email: string,
        team: string,
        role: string,
        isLead: boolean,
        isExec: boolean
    ) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { closeModal } = useModal();

    const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        if (!user) return;

        const getAllMembers = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/teams`);

                console.log("API USERS:", res.data.users);

                setMembers(res.data.users);

            } catch (error) {
                console.error(error);
            }
        };

        getAllMembers();
    }, [user]);

    useEffect(() => {
        console.log("UPDATED MEMBERS:", members);
    }, [members]);

    const removeMember = async (memberId: string, teamId: string) => {

        // Removes a member from a specific team

       try {
            setLoading(true);
            setError("");

            const teamSlug = teamId.toLowerCase().replace(/\s+/g, "-");

            // console.log("TEAMID:", teamSlug);
            // console.log("MEMBERID:", memberId);

            const res = await axios.delete(
                `${apiUrl}/api/teams/${teamSlug}/${memberId}`
            );

            setMembers((prev) =>
                prev.map((member) =>
                    member.userID === memberId
                        ? { ...member, team: "" }
                        : member
                )
            );

            if (user && user.userID === memberId) {
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

    const syncTeam = async(teamName: string) => {

        // Syncs teams across users so that they can get the updated member list in a team

        try {
            setLoading(true);

            await axios.get(`${apiUrl}/api/teams/${teamName}`)
            .then((res) => {
                setMembers((prev) => [
                    ...prev.filter((member) => member.team !== teamName),
                    ...res.data.members
                ]);
                console.log("DONE");
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddMember = async (selectedMember: any, selectedTeam: any, selectedRole: any, isLead: any, isExec: any, execRole: any) => {
        if (!selectedMember) return;

        const member = members.find(
            (member) => member.userID === selectedMember
        );

        if (!member) return;

        console.log("Added Member:", member);

        // Connect this to your add-member API next.
        await axios.post(
    `${apiUrl}/api/teams/${selectedTeam}/${member.userID}`,
    {
        role: selectedRole,
        isLead,
        isExec,
        execRole
    }).then((res) => {
            console.log(res.data);
            const newMember = res.data.member;
            setMembers((prev) =>
                prev.map((member) =>
                    member.userID === newMember.userID
                        ? newMember
                        : member
                )
            );
            closeModal();
        }).catch(err => {
            console.log(err);
        })
    };

    const handleCreateMember = async (
        name: string,
        email: string,
        team: string,
        role: string,
        isLead: boolean,
        isExec: boolean
    ) => {
        try {
            const res = await axios.post(
                `${apiUrl}/api/teams/${encodeURIComponent(team)}/create-member`,
                {
                    name,
                    email,
                    role,
                    isLead,
                    isExec
                }
            );

            const newMember = res.data.member;

            setMembers(prev => [...prev, newMember]);

            closeModal();

        } catch (error) {
            console.error("Error creating member:", error);
        }
    };

    return (
        <TeamContext.Provider
            value={{
                members,
                setMembers,
                loading,
                error,
                setError,
                removeMember,
                syncTeam,
                handleAddMember,
                handleCreateMember
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
