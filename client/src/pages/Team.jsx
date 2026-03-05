import { useTeam } from '../hooks/useTeam';
import MemberList from '../components/team/MemberList';
import Spinner from '../components/common/Spinner';

export default function Team() {
  const { data: members, loading } = useTeam();

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Team</h1>
        <p>Your product team members</p>
      </div>

      <MemberList members={members} />
    </div>
  );
}
