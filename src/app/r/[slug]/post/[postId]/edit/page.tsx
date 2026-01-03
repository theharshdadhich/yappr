import { Button } from '@/components/ui/Button'
import EditEditor from '@/components/EditEditor'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface EditPostPageProps {
  params: {
    slug: string
    postId: string
  }
}

const EditPostPage = async ({ params }: EditPostPageProps) => {
  const session = await getAuthSession()

  if (!session?.user) {
    return notFound()
  }

  const post = await db.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      author: true,
      subreddit: true,
    },
  })

  if (!post) {
    return notFound()
  }

  // Check if user is the author
  if (post.authorId !== session.user.id) {
    return notFound()
  }

  return (
    <div className='flex flex-col items-start gap-6'>
      {/* heading */}
      <div className='border-b border-gray-200 pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
            Edit Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <EditEditor
        postId={post.id}
        subredditId={post.subredditId}
        initialTitle={post.title}
        initialContent={post.content}
      />

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form' isLoading={false}>
          Update Post
        </Button>
      </div>
    </div>
  )
}

export default EditPostPage

