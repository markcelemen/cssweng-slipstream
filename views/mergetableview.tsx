import {
  Button,
  Flex,
  IconButton,

  Input,
  
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useState} from "react";


const MergeTableView = () => {

    const FileUploadButton = ({ label, expectedColumns }: { label: string; expectedColumns: string }) => {
        const [fileName, setFileName] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const infoBoxRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeft, setScrollLeft] = useState(0);
    
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                setFileName(e.target.files[0].name);
            }
        };

        const handleRemoveFile = () => {
            setFileName(null);
            if (fileInputRef.current) {
            fileInputRef.current.value = '';
            }
        };

        //manual scroll handlers
        const startDrag = (e: React.MouseEvent) => {
            if (!infoBoxRef.current) return;
            setIsDragging(true);
            setStartX(e.pageX - infoBoxRef.current.offsetLeft);
            setScrollLeft(infoBoxRef.current.scrollLeft);
        };

        const duringDrag = (e: React.MouseEvent) => {
            if (!isDragging || !infoBoxRef.current) return;
            e.preventDefault();
            const x = e.pageX - infoBoxRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Scroll multiplier
            infoBoxRef.current.scrollLeft = scrollLeft - walk;
        };

        const endDrag = () => {
            setIsDragging(false);
        };

        return (
            <div className="FileUploadContainer">
                <div className="FileUploadRow">

                    
                    <div className="FileUploadBoxes">
                        <span className="FileUploadLabel">
                        {label}
                        </span>

                        <div 

                            className={`FileInfoBox ${isDragging ? 'grabbing' : ''}`}
                            ref={infoBoxRef}
                            onMouseDown={startDrag}
                            onMouseMove={duringDrag}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                        
                        >
                            {fileName ? fileName : `Expected: ${expectedColumns}`}
                        </div>
                        <label className="FileUploadButton">
                            {fileName ? (
                            <div className="RemoveFile" onClick={handleRemoveFile}>✕</div>
                            ) : (
                            <div className="RemoveFile">Choose File</div>
                            )}
                            <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".csv,.xlsx" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            />
                        </label>
                       
                    </div>
                </div>
            </div>
        );
    };


 return (
    <div className="BiggestFormWrapper" >
        <div className="HeaderPageWrapper">
            <div className="PageBiggestText"> 
                Merge Attendance Data
            </div>

            <div className="DescriptionofPage"> 
                Upload raw attendance files and merge them to generate entries in the attendance table
            </div>
      </div>

        <div className="ImportAreaWrapper">

            <div className="GlogWrapper">
                <FileUploadButton 
                    label="Glog csv" 
                    expectedColumns="No, Mchn, EnNo, Name, Mode, IOMd, DateTime" 
                />
            </div>

            <div className="GdocWrapper">
                <FileUploadButton 
                    label="Gdoc csv" 
                    expectedColumns="Timestamp, Name of Employee, Action, Note" 
                />
            </div>

            <div className="PayslipWrapper">
                <FileUploadButton 
                    label="Payslip csv" 
                    expectedColumns="ID, Name, Position, Monthly Total Pay, Basic Pay, 1/2 Basic Pay" 
                />
            </div>

      </div>

        <div className="SummaryAndPreviewWrapper">
            <div className="MatchingSummaryWrapper">
                <div className="MatchingHeader text"> 
                
                Matching Summary

                </div>
                <div className="insideSummaryBox smalltext">
                <div><span>✓</span> 145/150 IDs matched between GLog and Payslip </div>
                {
                    //change the icon within the span according to if its okay or not (idk what is considered safe)
                }
                <div><span>✓</span> 143/145 Names matched between GDoc and Payslip</div>
                <div><span>⚠️</span> 2 unmatched entries from GDoc <u>(click to review)</u></div>
                 {
                    //maybe a modal for click to review Im not sure what it should show
                }
                </div>
                <div className="PrevAndNextButtonWrapper ReverseRowWrapper">
                    <button>Merge Files</button>
                    <button>Cancel</button>
                </div>
            </div>
            <div className="FilePreviewWrapper">
                <div className="PreviewHeader">
                    <div className="FileName text">
                        *File*.csv Preview 
                        
                        
                        
                    </div>
                    <div className="TitleOfFile text">
                        Glog CSV
                    </div>
                    <div className="PrevAndNextButtonWrapper">
                        <button>Prev File</button>
                        <button>Next File</button>
                    </div>

                </div>
                <div className="ActualTableWrapper">
                    table area
                </div>
                <div className="PagnationWrapper"> 
                    {
                        //PAGINATION NOT WORKING BEACUSE IM NOT SURE HOW THE OBJECTS WILL LOOK SORRY DEVS
                    }
                    <Flex
                        position="relative"
                       
                        align="center"
                        justify="center"
                        gap={2}
                        zIndex={10}
                        bg="#FFFCD9"
                        p={2}
                        borderRadius="md"
                        boxShadow="0px 0px 16px  rgba(0, 0, 0, 0.1)"
                        >
                        <IconButton
                            icon={<ChevronLeftIcon />}
                            aria-label="Previous page"
                            size="sm"
                            color="#638813"
                            
                            _hover={{ bg: "#E6E2B1",color: "#FFCF50" }}
                            isDisabled={false} 
                        />
                        <Button 
                            size="sm" 
                            color="#626F47" 
                            variant="ghost"
                            _hover={{ color: "#FFCF50" }}
                        >
                            1
                        </Button>
                        <Input
                            value="1" //Static value
                            size="sm"
                            width="44px"
                            color="#638813"
                            textAlign="center"
                            
                            mx={1}
                            readOnly 
                        />
                        <Button 
                            size="sm" 
                            color="#638813"
                            
                            _hover={{ color: "#FFCF50" }}
                        >
                            5 {/* Example total pages */}
                        </Button>
                        <IconButton
                            icon={<ChevronRightIcon />}
                            aria-label="Next page"
                            color="#638813"
                            size="sm"
                            bg="red"
                            _hover={{color: "#FFCF50"}}
                            isDisabled={false} 
                        />
                        </Flex>
                </div>
            </div>


        </div>
    </div>
  );





};

export default MergeTableView;