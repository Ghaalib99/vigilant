import Link from 'next/link'
import React from 'react'

function DashBoardQuickMenu({ data }) {
    return (
        <Link href={data.link}>
            <div className={`${data?.bg} h-full bg-opacity-20 px-4 py-6 space-y-4 rounded-xl`}>
                <div className='text-3xl'>{data.icon}</div>
                <div className='font-bold text-sm sm:text-base text-green'>{data.title}</div>
                <div className='text-xs'>{data.description}</div>
            </div>
        </Link>
    )
}

export default DashBoardQuickMenu