package com.huudat1201.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
@Service // Đánh dấu class là một service Spring
@Slf4j   // Tự động tạo logger (log.info, log.error, ...)
public class AwsS3Service {

    public String bucketName = "huudat1201"; // Tên bucket S3 nơi bạn muốn lưu ảnh

    @Value("${aws.s3.access}") // Inject giá trị từ application.properties
    private String awsS3AccessKey;

    @Value("${aws.s3.secrete}") // Inject secret key từ properties
    private String awsS3SecreteKey;

    /**
     * Upload ảnh lên S3 và trả về URL public của ảnh.
     *
     * @param photo MultipartFile ảnh người dùng upload
     * @return URL của ảnh sau khi upload lên Amazon S3
     */
    public String saveImageToS3(MultipartFile photo){
        try {
            String s3FileName = photo.getOriginalFilename(); // Lấy tên file gốc

            // Tạo credentials AWS bằng access key và secret key
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecreteKey);

            // Tạo client S3 với credentials và region (us-east-1)
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(Regions.US_EAST_1)
                    .build();

            // Lấy input stream từ file ảnh
            InputStream inputStream = photo.getInputStream();

            // Tạo metadata cho file (định dạng MIME)
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/jpeg"); // Cố định là JPEG, có thể chỉnh sửa nếu cần

            // Tạo yêu cầu upload file lên bucket với key là tên file
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream, metadata);
            s3Client.putObject(putObjectRequest); // Tiến hành upload

            // Trả về URL public của ảnh đã upload
            return "https://" + bucketName + ".s3.us-east-1.amazonaws.com/" + s3FileName;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Unable to upload image to s3 bucket: " + e.getMessage());
        }
    }
}