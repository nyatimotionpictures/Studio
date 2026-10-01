import React from 'react'
import Button from '../Buttons/Button'
import { buildShareLink } from '../../config'
import { copyToClipboard } from '../../lib/shareLink'

const ViewEpisodeData = ({film, parentSlugs}) => {
  const [copied, setCopied] = React.useState(false);

  const shareLink = buildShareLink(
    { slug: film?.slug, type: 'episode' },
    parentSlugs
  );

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareLink);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
    {/** type & year of production */}
    <div className='flex items-center gap-10'>
        <div className="flex flex-col gap-[7px] min-w-[150px]">
            <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Episode Number</h1>
            <p className="font-[Inter-Regular] text-base text-[#706E72]">{film?.episode}</p>
          
        </div>

        <div className="flex flex-col gap-[7px] min-w-[150px]">
            <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Year Of Production</h1>
            <p className="font-[Inter-Regular] text-base text-[#706E72]">{film?.yearOfProduction}</p>
        </div>
    </div>
    {/** Genre */}
    <div className="flex flex-col gap-[7px] min-w-[150px]">
        <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Genre</h1>
        <ul className='flex flex-wrap'>
            {film?.genre.map((data, index) => (
                <span
                    key={index}
                    className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                >
                    {(index ? ", " : "") + data}
                </span>
            ))}
        </ul>
    </div>

    {/** Audio Languages & Subtitles */}
    <div className='flex items-center gap-10'>
        <div className="flex flex-col gap-[7px] min-w-[150px]">
            <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Audio Languages</h1>
            <ul className='flex flex-wrap'>
                {film?.audioLanguages?.map((data, index) => (
                    <span
                        key={index}
                        className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                    >
                        {(index ? ", " : "") + data}
                    </span>
                ))}
            </ul>
        </div>

        <div className="flex flex-col gap-[7px] min-w-[150px]">
            <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Subtitles</h1>
            <ul className='flex flex-wrap'>
                {film?.subtitleLanguage?.map((data, index) => (
                    <span
                        key={index}
                        className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                    >
                        {(index ? ", " : "") + data}
                    </span>
                ))}
            </ul>
        </div>
    </div>

    {/** Runtime in Minutes */}
    <div className="flex flex-col gap-[7px] min-w-[150px]">
        <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Runtime in Minutes</h1>
        <p className="font-[Inter-Regular] text-base text-[#706E72]">
            {film?.runtime}
        </p>
    </div>

    {/** Plot Summary */}
    <div className="flex flex-col gap-[7px] min-w-[150px]">
        <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Summary</h1>
        <p className="font-[Inter-Regular] text-base text-[#706E72]">
            {film?.plotSummary}
        </p>
    </div>

    {/** Plot Synopsis */}
    <div className="flex flex-col gap-[7px] min-w-[150px]">
        <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Synopsis</h1>
        <p className="font-[Inter-Regular] text-base text-[#706E72]">
           {film?.overview}
        </p>
    </div>

    {/** share link */}
    <div className="flex flex-col gap-2">
        <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Share Link</h1>
        {shareLink ? (
            <>
                <p className="font-[Inter-Regular] text-sm text-[#706E72]">
                    {copied ? 'Link copied to clipboard' : 'Public link for this episode'}
                </p>
                <div className="flex flex-row items-center gap-3">
                    <input
                        id="episodeShareLink"
                        type="text"
                        readOnly
                        value={shareLink}
                        onFocus={(event) => event.target.select()}
                        className="flex-1 font-[Inter-Regular] text-sm text-whites-40"
                    />
                    <Button
                        type="button"
                        onClick={handleCopy}
                        title="Copy link"
                        aria-label="Copy link"
                        className="h-[43px] w-[43px] flex items-center justify-center px-0 rounded-md"
                    >
                        <span
                            className={`w-5 h-5 ${copied ? 'icon-[solar--copy-bold]' : 'icon-[solar--copy-linear]'}`}
                        ></span>
                    </Button>
                </div>
            </>
        ) : (
            <p className="font-[Inter-Regular] text-sm text-[#706E72]">
                {film?.slug
                    ? 'The public link needs the series and season, which are set once this episode is saved.'
                    : 'No link yet. Edit content to set one.'}
            </p>
        )}
    </div>
</div>
  )
}

export default ViewEpisodeData