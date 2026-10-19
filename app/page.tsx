import { gql } from '@apollo/client';
import type { Metadata } from 'next';
import Image from 'next/image';
import { query } from '../util/apolloClient';

export const metadata: Metadata = {
  title: 'Profile Page',
  description:
    'Explore this developer profile page featuring user details, technical skills, featured projects, and public repositories',
};

// Tip: use GraphQL Code Generator to avoid writing TypeScript type by hand
// https://www.apollographql.com/tutorials/lift-off-part1/09-codegen
type GithubProfileType = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          id: string;
          name: string;
          defaultBranchRef: {
            name: string;
          };
        };
      }[];
    };
  };
};

export default async function Home() {
  const { data } = await query<GithubProfileType>({
    query: gql`
      query GithubProfile($username: String!) {
        user(login: $username) {
          name
          avatarUrl
          repositories(last: 10) {
            edges {
              node {
                id
                name
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      username: 'karlhorky',
    },
  });

  if (!data) {
    throw new Error('data is undefined');
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-10 text-[#c9d1d9]">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <section className="h-fit rounded-md border border-[#30363d] bg-[#161b22] p-6">
          <Image
            src={data.user.avatarUrl}
            alt={`${data.user.name} avatar`}
            width={220}
            height={220}
            className="h-auto w-full rounded-full border border-[#30363d]"
          />
          <h1 className="mt-5 text-2xl font-semibold text-[#f0f6fc]">
            {data.user.name}
          </h1>
          <p className="mt-1 text-sm text-[#8b949e]">Software developer</p>
          <div className="mt-4 inline-flex items-center rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#c9d1d9]">
            {data.user.repositories.edges.length} public repos
          </div>
        </section>

        <section className="rounded-md border border-[#30363d] bg-[#0d1117] p-6">
          <div className="mb-5 border-b border-[#21262d] pb-3">
            <h2 className="text-lg font-semibold text-[#f0f6fc]">
              Popular repositories
            </h2>
            <p className="text-sm text-[#8b949e]">
              Showing first {data.user.repositories.edges.length} repositories
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {data.user.repositories.edges.map(({ node: repository }) => {
              return (
                <li
                  key={repository.id}
                  className="rounded-md border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#58a6ff]"
                >
                  <p className="truncate text-sm font-semibold text-[#58a6ff]">
                    {repository.name}
                  </p>
                  <p className="mt-2 text-xs text-[#8b949e]">
                    Default branch:{' '}
                    <span className="font-medium text-[#c9d1d9]">
                      {repository.defaultBranchRef.name}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
